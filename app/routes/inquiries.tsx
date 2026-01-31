import { generateSEOTags } from "@/lib/utils/seo";
import { href } from "react-router";

export function meta() {
  return [
    ...generateSEOTags({
      title: "Learning Africa | Inquiries for organization setup and support",
      description:
        "Submit an inquiry to Learning Africa for organization setup, support, or any questions related to our data science and AI-powered learning solutions.",
      url: href("/inquiries"),
      image: "/og.png",
      keywords:
        "inquiries,organization setup,support,learning africa,artificial intelligence,AI solutions,Africa,education,edtech",
    }),
  ];
}

export default function Inquiries() {
  return <div>Inquiries</div>;
}
