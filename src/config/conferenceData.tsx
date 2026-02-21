import React from "react";
import { Brain, Bot, Sprout, Cpu, Leaf, BarChart3, Microscope, LucideProps } from "lucide-react";

export interface Track {
    id: string;
    title: string;
    theme: string;
    iconName: string;
    color: string;
    topics: string[];
    academicRelevance: string;
}

export const conferenceTracks: Track[] = [
    {
        id: "precision-ag",
        title: "Session 1: Precision Agriculture & Smart Farming",
        theme: "Using data, sensors, and analytics to optimize agricultural systems.",
        iconName: "Sprout",
        color: "#1FCB8F",
        topics: [
            "AI-Driven Crop Monitoring & Prediction",
            "Sensor Networks & Ambient IoT",
            "Geospatial & Remote Sensing Technologies",
            "Variable Rate Technology (VRT)",
            "Data Interoperability & Adoption Barriers"
        ],
        academicRelevance: "Precision agriculture is a transformative approach for modern farming and sustainability improvement."
    },
    {
        id: "ai-ml-ag",
        title: "Session 2: Artificial Intelligence & Machine Learning in Agriculture",
        theme: "Next-gen AI tools reshaping farm analytics and automation.",
        iconName: "Brain",
        color: "#FF3B8A",
        topics: [
            "Vision Transformers for Crop Analysis",
            "ML for Pest & Disease Detection",
            "AI for Resource Optimization",
            "Generative AI & Farmer Assistants",
            "Explainable AI for Agricultural Decisions"
        ],
        academicRelevance: "Machine learning is one of the most vibrant research domains advancing smart agriculture."
    },
    {
        id: "sustainable-ag",
        title: "Session 3: Sustainable & Climate-Smart Agriculture",
        theme: "Tech for environmental resilience and long-term sustainability.",
        iconName: "Leaf",
        color: "#10B981",
        topics: [
            "Climate Resilient Farm Systems",
            "Digital Irrigation & Water Management",
            "Agri-voltaics & Dual-Use Systems",
            "Eco-friendly Pest & Input Technologies",
            "Sustainable Supply Chain Traceability"
        ],
        academicRelevance: "Sustainable agriculture generates major research interest, especially when paired with tech."
    },
    {
        id: "robotics-auto",
        title: "Session 4: Robotics, Automation & Autonomous Systems",
        theme: "Hardware and robotics transforming farm operations.",
        iconName: "Bot",
        color: "#5B4DFF",
        topics: [
            "Autonomous Tractors & Field Robots",
            "Drones for Precision Application",
            "Swarm Robotics in Agriculture",
            "Human-Robot Interaction for Farms",
            "Economic Impact & Adoption Strategy"
        ],
        academicRelevance: "Robotics continue to be a core research theme as labor inefficiencies spur automation."
    },
    {
        id: "market-dynamics",
        title: "Session 5: AgTech Market Dynamics & Innovation Ecosystems",
        theme: "Market trends, investment, adoption barriers & policy frameworks.",
        iconName: "BarChart3",
        color: "#FD9D24",
        topics: [
            "Global AgTech Market Analysis",
            "Startup Chill & Funding Dynamics",
            "Farmer Adoption & Economic Models",
            "Public Policy & Agri Digital Infrastructure",
            "AgTech Business Models & Scaling"
        ],
        academicRelevance: "Understanding market forces helps frame tech adoption research."
    },
    {
        id: "emerging-tech",
        title: "Session 6: Emerging Technologies & Future Horizons",
        theme: "Cutting-edge research shaping the next decade of agriculture.",
        iconName: "Microscope",
        color: "#00C2FF",
        topics: [
            "Nano-Technology in Agriculture",
            "Digital Twin & Simulation in Farms",
            "Metaverse & XR for Farm Training",
            "Bio-engineering & Crop Genomics",
            "Agriculture & Space Technologies"
        ],
        academicRelevance: "These are frontier topics being actively explored in research labs globally."
    }
];

export const getIcon = (name: string, props: LucideProps = {}) => {
    switch (name) {
        case "Brain": return <Brain {...props} />;
        case "Bot": return <Bot {...props} />;
        case "Sprout": return <Sprout {...props} />;
        case "Cpu": return <Cpu {...props} />;
        case "Leaf": return <Leaf {...props} />;
        case "BarChart3": return <BarChart3 {...props} />;
        case "Microscope": return <Microscope {...props} />;
        default: return <Brain {...props} />;
    }
};
