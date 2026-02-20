"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetUserQuery } from "@/redux/services/authApi";
import Hero from "@/components/home/Hero";

export default function HomePage() {
  const router = useRouter();
  const { data, isLoading } = useGetUserQuery();

  useEffect(() => {
    if (!isLoading && data?.user) {
      router.replace("/dashboard");
    }
  }, [data, isLoading, router]);

  if (isLoading) return null;

  return <Hero />;
}
