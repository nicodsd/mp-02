"use client";
import React, { useEffect } from "react";

export default function Test() {
  useEffect(() => {
    console.log("useEffect ejecutado");
  }, []);

  return <div>Test Component</div>;
}
