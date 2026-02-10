"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Submissions", href: "/call-for-papers" },
    { label: "Speakers", href: "/speakers" },
    { label: "Schedule", href: "/sessions" },
    { label: "About", href: "/about" },
];

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mobile-nav-container">
            <button
                className={`hamburger ${isOpen ? "is-active" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation"
            >
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </button>

            <div className={`mobile-menu-overlay ${isOpen ? "is-open" : ""}`} onClick={() => setIsOpen(false)}>
                <nav className="mobile-menu solid-theme" onClick={(e) => e.stopPropagation()}>
                    <div className="mobile-menu-header">
                        <Image
                            src="/Iaisr%20Logo.webp"
                            alt="IAISR Logo"
                            className="mobile-menu-logo"
                            width={120}
                            height={40}
                        />
                        <button className="close-menu" onClick={() => setIsOpen(false)}>X</button>
                    </div>
                    <div className="mobile-links-wrapper">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="mobile-nav-link"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <Link
                        href="/register"
                        className="btn mobile-register-btn-solid"
                        onClick={() => setIsOpen(false)}
                    >
                        Register Now
                    </Link>
                </nav>
            </div>
        </div>
    );
}
