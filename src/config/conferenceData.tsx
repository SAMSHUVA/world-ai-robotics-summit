import React from "react";
import { Brain, Bot, AlertCircle, Network, Cpu, ShieldCheck, LucideProps } from "lucide-react";

export interface Track {
    id: string;
    title: string;
    iconName: string;
    color: string;
    topics: string[];
}

export const conferenceTracks: Track[] = [
    {
        id: "gen-ai",
        title: "Generative AI",
        iconName: "Brain",
        color: "#FF3B8A",
        topics: ["LLMs & Transformers", "Diffusion Models", "Creative AI"]
    },
    {
        id: "robotics",
        title: "Autonomous Robotics",
        iconName: "Bot",
        color: "#5B4DFF",
        topics: ["Human-Robot Interaction", "Swarm Robotics", "SLAM"]
    },
    {
        id: "vision",
        title: "Computer Vision",
        iconName: "AlertCircle",
        color: "#1FCB8F",
        topics: ["Object Detection", "3D Reconstruction", "NeRFs"]
    },
    {
        id: "ml",
        title: "Machine Learning",
        iconName: "Network",
        color: "#FD9D24",
        topics: ["Deep Learning", "Self-Supervised Learning", "Optimization"]
    },
    {
        id: "edge-ai",
        title: "Edge AI & IoT",
        iconName: "Cpu",
        color: "#00C2FF",
        topics: ["TinyML", "Distributed AI", "Smart Sensors"]
    },
    {
        id: "ethics",
        title: "AI Ethics",
        iconName: "ShieldCheck",
        color: "#FFBD3E",
        topics: ["Fairness & Bias", "Explainable AI (XAI)", "AI Policy"]
    }
];

export const getIcon = (name: string, props: LucideProps = {}) => {
    switch (name) {
        case "Brain": return <Brain {...props} />;
        case "Bot": return <Bot {...props} />;
        case "AlertCircle": return <AlertCircle {...props} />;
        case "Network": return <Network {...props} />;
        case "Cpu": return <Cpu {...props} />;
        case "ShieldCheck": return <ShieldCheck {...props} />;
        default: return <Brain {...props} />;
    }
};
