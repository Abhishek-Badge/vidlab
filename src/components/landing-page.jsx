import React, { useMemo, useState } from "react";
import { Navbar, Nav, Button, Container, Row, Col, Card, Accordion, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./landing-page.css";

export default function VidLabLanding({ theme, toggleTheme }) {
    const [faqFilter, setFaqFilter] = useState("all");

    const categories = [
        { title: "Education", icon: "bi-book", color: "#4cafef" },
        { title: "Technology", icon: "bi-cpu", color: "#f39c12" },
        { title: "Comedy", icon: "bi-emoji-laughing", color: "#2ecc71" },
        { title: "Travel", icon: "bi-geo-alt", color: "#e74c3c" },
    ];

    const faqs = useMemo(
        () => [
            { key: "0", audience: "users", q: "What is VidLab?", a: "VidLab is your video hub to learn, enjoy, and share ideas—organized by categories with likes, comments, and Save for Later." },
            { key: "1", audience: "users", q: "Is VidLab free?", a: "Watching is free. We may add optional premium features later." },
            { key: "2", audience: "admins", q: "How do admins manage content?", a: "Admins can add, edit, and review categories/videos from the Admin Dashboard." },
            { key: "3", audience: "users", q: "Can I save videos for later?", a: "Yes—use the Watch Later icon on any video card." },
            { key: "4", audience: "admins", q: "Can admins moderate comments?", a: "Yes—role-based moderation is supported. Comments aren’t available yet, but will be added in future updates with full admin control." },
        ],
        []
    );

    const filteredFaqs = faqs.filter(f => faqFilter === "all" ? true : f.audience === faqFilter);

    return (
        <div>

            {/* HEADER */}
            <Navbar expand="lg" className="vidlab-navbar px-3 py-2">
                <Container fluid className="d-flex justify-content-between align-items-center">

                    {/* Brand + slogan (slogan sits at the top-right of the word "VidLab") */}
                    <div className="brand-wrap">
                        <span className="brand-text">Vidlab</span>
                        <span className="brand-slogan">Your World in Video.</span>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        <Button variant="outline-info bi bi-people" as={Link} to="/user-login">
                            User Login
                        </Button>
                        <Button variant="info bi bi-shield" as={Link} to="/admin-login">
                            Admin Login
                        </Button>

                        {/* Dark/Light toggle with hover tooltip */}

                        <OverlayTrigger
                            placement="bottom"
                            overlay={
                                <Tooltip id="theme-tooltip">
                                    {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                                </Tooltip>
                            }>

                            <Button
                                variant="light"
                                className="theme-toggle-btn"
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                            >
                                <i className={`bi ${theme === "light" ? "bi-moon-fill" : "bi-sun-fill"}`}></i>
                            </Button>
                        </OverlayTrigger>
                    </div>
                </Container>
            </Navbar>


            {/* HERO */}
            <section className="hero-img">
                <div className="hero-overlay">
                    <Container className="text-center text-light">
                        <h1 className="hero-title">VidLab</h1>
                        <p className="hero-subtitle">Welcome, VidLab users—your ultimate video library.</p>
                        <p className="hero-tagline">Discover by categories, like, comment, and save for later — all in one place.</p>
                        <Button size="lg" variant="danger" className="mt-3 bi bi-play" as={Link} to="/user-login">
                            Get Started
                        </Button>
                    </Container>
                </div>
            </section>

            {/* POPULAR CATEGORIES */}
            <section className="categories-section py-5">
                <Container>
                    <h2 className="section-title text-center mb-4">Popular Categories</h2>
                    <Row>
                        {categories.map((cat, i) => (
                            <Col md={3} sm={6} xs={12} key={i} className="mb-4">
                                <Card className="category-card text-center shadow-sm" style={{ borderTop: `5px solid ${cat.color}` }}>
                                    <Card.Body>
                                        <i className={`bi ${cat.icon} category-icon`} style={{ color: cat.color }}></i>
                                        <Card.Title className="mb-0">{cat.title}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* FAQ */}
            <section className="faq-section py-5">
                <Container>
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                        <h2 className="section-title m-0">FAQs</h2>
                        <div className="faq-pills btn-group" role="group" aria-label="FAQ Filters">
                            <Button variant={faqFilter === "all" ? "danger" : "outline-secondary"} onClick={() => setFaqFilter("all")}>All</Button>
                            <Button variant={faqFilter === "users" ? "danger" : "outline-secondary"} onClick={() => setFaqFilter("users")}>Users</Button>
                            <Button variant={faqFilter === "admins" ? "danger" : "outline-secondary"} onClick={() => setFaqFilter("admins")}>Admins</Button>
                        </div>
                    </div>

                    <Accordion alwaysOpen className="faq-accordion">
                        {filteredFaqs.map(({ key, q, a, audience }) => (
                            <Accordion.Item eventKey={key} key={key}>
                                <Accordion.Header>
                                    <i className={`bi ${audience === "admins" ? "bi-shield-lock" : "bi-people"} me-2`}></i>
                                    {q}
                                    <Badge bg="secondary" className="ms-2 text-uppercase">{audience}</Badge>
                                </Accordion.Header>
                                <Accordion.Body>{a}</Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Container>
            </section>

            {/* FOOTER */}
            <footer className="footer text-center py-3">
                © 2024 Vidlab. All rights reserved.
            </footer>
        </div>
    );
}
