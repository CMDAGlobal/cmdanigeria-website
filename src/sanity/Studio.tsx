import { Studio as SanityStudio } from "sanity";
import "sanity/bundle.css";
import { studioConfig } from "./studioConfig";

export default function StudioComponent() {
  return <SanityStudio config={studioConfig} />;
}