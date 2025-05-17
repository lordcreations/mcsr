"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

import { useAuth } from "./MicrosoftAuthProvider";
import Image from "next/image";
import { useState, useEffect } from "react";
import { brazilStates } from "@/lib/countries";
import { AlertCircle, CheckCircle, Loader2, Save } from "lucide-react";

function validDate(date: any): string {
    if (!date) return "Unknown";
    const d = typeof date === "number" ? new Date(date * 1000) : new Date(date);
    if (isNaN(d.getTime())) return "Unknown";
    return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

interface UserProfile {
    uuid: string;
    nickname: string;
    country: string;
    seasonResult?: any;
    timestamp?: {
        firstOnline?: number;
        lastOnline?: number;
    };
}

export default function Profile() {
    const { user, loading } = useAuth();
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<string>("unknown");
    const [savedSuccess, setSavedSuccess] = useState(false);

    // Fetch user profile data
    useEffect(() => {
        if (!user?.uuid) return;

const fetchProfileData = async () => {
  try {
    setIsLoading(true);
    
    // First try to get from our DB
    let response = await fetch(`/api/users/profile?uuid=${user.uuid}`);
    
    if (response.ok) {
      // Successfully retrieved profile from our database
      const userData = await response.json();
      setProfileData(userData);
      setSelectedCountry(userData.country || "unknown");
    } else {
      // If not found in our DB, fetch from MCSR API
      response = await fetch(`https://mcsrranked.com/api/users/${user.uuid}`);
      const mcsrData = await response.json();
      
      if (mcsrData.data) {
        const profile: UserProfile = {
          uuid: user.uuid ?? "",
          nickname: user.displayName,
          country: mcsrData.data.country || "unknown",
          seasonResult: mcsrData.data.seasonResult,
          timestamp: mcsrData.data.timestamp,
        };
        
        setProfileData(profile);
        setSelectedCountry(profile.country);
        
        // Save this profile to our database for future use
        await fetch('/api/users/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uuid: user.uuid,
            nickname: user.displayName,
            country: profile.country,
          }),
        });
      }
    }
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    // Create a default profile if we can't fetch data
    const defaultProfile: UserProfile = {
      uuid: user.uuid ?? "",
      nickname: user.displayName,
      country: "unknown",
    };
    setProfileData(defaultProfile);
    setSelectedCountry("unknown");
  } finally {
    setIsLoading(false);
  }
};

        fetchProfileData();
    }, [user]);

    const handleSaveProfile = async () => {
        if (!user?.uuid) return;

        try {
            setIsSaving(true);

            const response = await fetch('/api/users/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uuid: user.uuid,
                    nickname: user.displayName,
                    country: selectedCountry,
                }),
            });

            if (response.ok) {
                setProfileData(prev => prev ? { ...prev, country: selectedCountry } : null);
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 3000);
                toast("Profile saved: Your city has been updated successfully.");
            } else {
                const error = await response.text();
                throw new Error(error);
            }
        } catch (error) {
            console.error("Failed to save profile:", error);
            toast("Failed to save", {
                description: "There was an error saving your profile. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || isLoading) {
        return (
            <div className="w-full max-w-4xl mx-auto mt-8 p-4">
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    <p className="mt-4 text-lg font-minecraft text-gray-600 dark:text-gray-400">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="w-full max-w-4xl mx-auto mt-8 p-4">
                <div className="flex flex-col items-center justify-center py-16 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <AlertCircle className="h-12 w-12 text-amber-500" />
                    <h2 className="mt-4 text-xl font-minecraft">You need to login</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Please login with your Minecraft account to view and edit your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto mt-8 p-4">
            <Card className="border border-gray-300 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-900 text-black dark:text-white">
                <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative">
                            <Image
                                src={`/api/player-head?uuid=${user.uuid}`}
                                alt={user.displayName}
                                width={80}
                                height={80}
                                className="rounded-md shadow-md"
                                style={{ imageRendering: "pixelated" }}
                            />
                            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-900 rounded-full p-0.5 shadow">
                                <div className="h-5 w-5 rounded-full bg-green-500 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <CardTitle className="text-2xl font-minecraft">{user.displayName}</CardTitle>
                            <CardDescription className="text-sm font-minecraft opacity-75">
                                UUID: {user.uuid}
                            </CardDescription>
                            <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
                                <div className="flex items-center">
                                    <Image
                                        src={`/flags/${profileData?.country || 'unknown'}.svg`}
                                        alt="city flag"
                                        width={20}
                                        height={20}
                                        className="rounded shadow"
                                    />
                                </div>
                                {profileData?.timestamp?.firstOnline && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Joined: {validDate(profileData.timestamp.firstOnline)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="max-w-md mx-auto bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                        <div className="space-y-4">
                            <div className="text-center mb-4">
                                <h3 className="font-minecraft text-xl mb-2">Choose Your City</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Select the flag that will be displayed on your profile
                                </p>
                            </div>

                            {selectedCountry && (
                                <div className="flex flex-col items-center mb-4">
                                    <Image
                                        src={`/flags/${selectedCountry}.svg`}
                                        alt="Selected city flag"
                                        width={60}
                                        height={60}
                                        className="rounded-md shadow-md mb-2"
                                    />
                                    <span className="text-sm font-semibold">
                                        {brazilStates.find(c => c.code === selectedCountry)?.name || "Unknown"}
                                    </span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="country" className="font-minecraft">Country Selection</Label>
                                <Select
                                    value={selectedCountry}
                                    onValueChange={setSelectedCountry}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select your city" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        {brazilStates.map((country) => (
                                            <SelectItem key={country.code} value={country.code}>
                                                <div className="flex items-center gap-2">
                                                    <Image
                                                        src={`/flags/${country.code}.svg`}
                                                        alt={country.name}
                                                        width={16}
                                                        height={16}
                                                        className="rounded"
                                                    />
                                                    <span className="text-sm">{country.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end border-t border-gray-200 dark:border-gray-800 pt-4">
                    <Button
                        onClick={handleSaveProfile}
                        disabled={isSaving || selectedCountry === profileData?.country}
                        className="relative"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : savedSuccess ? (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Saved!
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save City
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
