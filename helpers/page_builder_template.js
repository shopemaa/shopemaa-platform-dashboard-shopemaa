// Handmade
export const pageBuilderLinkTreeTemplate = () => {
    return [{
        "id": "navbar-linktree",
        "type": "navbar",
        "props": {"brand": "Jane Doe", "menu": [], "sticky": false, "background": "#ffffff"},
        "children": []
    }, {
        "id": "section-profile",
        "type": "section",
        "props": {"container": true, "paddingY": "py-5", "background": "#f7f9fb"},
        "children": [{
            "id": "row-profile",
            "type": "row",
            "props": {"gutter": "g-4", "className": "justify-content-center"},
            "children": [{
                "id": "col-profile",
                "type": "col",
                "props": {"xs": 12, "md": 6, "className": "text-center"},
                "children": [{
                    "id": "profile-image",
                    "type": "image",
                    "props": {
                        "src": "https://randomuser.me/api/portraits/women/68.jpg",
                        "alt": "Jane Doe",
                        "width": "96px",
                        "className": "rounded-circle mb-3"
                    },
                    "children": []
                }, {
                    "id": "profile-name",
                    "type": "heading",
                    "props": {"level": 2, "text": "Jane Doe", "align": "center"},
                    "children": []
                }, {
                    "id": "profile-bio",
                    "type": "text",
                    "props": {
                        "text": "Designer • Creator • Dreamer<br>Welcome to my link hub!",
                        "align": "center",
                        "className": "text-muted"
                    },
                    "children": []
                }]
            }]
        }]
    }, {
        "id": "section-links",
        "type": "section",
        "props": {"container": true, "paddingY": "py-3", "background": "#ffffff"},
        "children": [{
            "id": "row-links",
            "type": "row",
            "props": {"gutter": "g-3", "className": "justify-content-center"},
            "children": [{
                "id": "col-links",
                "type": "col",
                "props": {"xs": 12, "md": 6},
                "children": [{
                    "id": "linktree-btn-website",
                    "type": "button",
                    "props": {
                        "label": "🌐 My Portfolio",
                        "href": "https://janedoe.com",
                        "className": "btn btn-outline-dark btn-lg w-100 mb-3"
                    },
                    "children": []
                }, {
                    "id": "linktree-btn-instagram",
                    "type": "button",
                    "props": {
                        "label": "📸 Instagram",
                        "href": "https://instagram.com/janedoe",
                        "className": "btn btn-outline-primary btn-lg w-100 mb-3"
                    },
                    "children": []
                }, {
                    "id": "linktree-btn-twitter",
                    "type": "button",
                    "props": {
                        "label": "🐦 Twitter",
                        "href": "https://twitter.com/janedoe",
                        "className": "btn btn-outline-info btn-lg w-100 mb-3"
                    },
                    "children": []
                }, {
                    "id": "linktree-btn-linkedin",
                    "type": "button",
                    "props": {
                        "label": "💼 LinkedIn",
                        "href": "https://linkedin.com/in/janedoe",
                        "className": "btn btn-outline-primary btn-lg w-100 mb-3"
                    },
                    "children": []
                }, {
                    "id": "linktree-btn-youtube",
                    "type": "button",
                    "props": {
                        "label": "▶️ YouTube",
                        "href": "https://youtube.com/janedoe",
                        "className": "btn btn-outline-danger btn-lg w-100 mb-3"
                    },
                    "children": []
                }, {
                    "id": "linktree-btn-newsletter",
                    "type": "button",
                    "props": {
                        "label": "📰 Join My Newsletter",
                        "href": "#newsletter",
                        "className": "btn btn-dark btn-lg w-100"
                    },
                    "children": []
                }]
            }]
        }]
    }, {
        "id": "section-newsletter",
        "type": "section",
        "props": {"container": true, "paddingY": "py-4", "background": "#f7f9fb"},
        "children": [{
            "id": "row-newsletter",
            "type": "row",
            "props": {"gutter": "g-2", "className": "justify-content-center"},
            "children": [{
                "id": "col-newsletter",
                "type": "col",
                "props": {"xs": 12, "md": 6},
                "children": [{
                    "id": "newsletter-form",
                    "type": "form",
                    "props": {
                        "title": "Subscribe for Updates",
                        "buttonLabel": "Subscribe",
                        "placeholder": "Your email address",
                        "action": "#",
                        "method": "POST",
                        "className": "mb-0"
                    },
                    "children": []
                }]
            }]
        }]
    }, {
        "id": "section-footer",
        "type": "section",
        "props": {"background": "#23272f", "paddingY": "py-4"},
        "children": [{
            "id": "footer-text",
            "type": "text",
            "props": {
                "text": "© 2024 Jane Doe. Powered by <a href='https://qrcentraal.com' style='color:#fff;'>QrCentraal</a>",
                "align": "center",
                "className": "text-white"
            },
            "children": []
        }]
    }]
}

export const pageBuilderRestaurantTemplate = () => {
    return [
        {
            "id": "navbar-main",
            "type": "navbar",
            "props": {
                "brand": "La Tavola",
                "menu": [
                    {
                        "label": "Home",
                        "href": "#"
                    },
                    {
                        "label": "Menu",
                        "href": "#menu"
                    },
                    {
                        "label": "About",
                        "href": "#about"
                    },
                    {
                        "label": "Contact",
                        "href": "#contact"
                    }
                ],
                "sticky": true,
                "background": "#ffffff"
            },
            "children": []
        },
        {
            "id": "hero-section",
            "type": "hero",
            "props": {
                "title": "Welcome to La Tavola",
                "subtitle": "Authentic Italian Cuisine in the Heart of the City",
                "bgUrl": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80",
                "height": 420,
                "overlay": 0.45,
                "align": "center",
                "textColor": "#fff",
                "className": "mb-0 text-center"
            },
            "children": []
        },
        {
            "id": "section-about",
            "type": "section",
            "props": {
                "container": true,
                "paddingY": "py-5",
                "background": "#f8fafc",
                "id": "about",
                "className": "text-center"
            },
            "children": [
                {
                    "id": "about-row",
                    "type": "row",
                    "props": {
                        "gutter": "g-4",
                        "align": "center",
                        "className": "justify-content-center"
                    },
                    "children": [
                        {
                            "id": "about-col-image",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 6,
                                "className": "d-flex justify-content-center"
                            },
                            "children": [
                                {
                                    "id": "about-image",
                                    "type": "image",
                                    "props": {
                                        "src": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
                                        "alt": "Restaurant Interior",
                                        "width": "100%",
                                        "className": "rounded shadow"
                                    },
                                    "children": []
                                }
                            ]
                        },
                        {
                            "id": "about-col-text",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 6,
                                "className": "d-flex flex-column justify-content-center align-items-center"
                            },
                            "children": [
                                {
                                    "id": "about-heading",
                                    "type": "heading",
                                    "props": {
                                        "level": 2,
                                        "text": "About La Tavola",
                                        "align": "center",
                                        "className": "mb-3 text-center"
                                    },
                                    "children": []
                                },
                                {
                                    "id": "about-text",
                                    "type": "text",
                                    "props": {
                                        "text": "At La Tavola, we bring the flavors of Italy to your table. Our chefs use the freshest ingredients to craft traditional dishes, from handmade pastas to wood-fired pizzas. Enjoy a warm, inviting atmosphere perfect for family dinners, romantic evenings, or celebrations with friends.",
                                        "align": "center",
                                        "className": "text-center"
                                    },
                                    "children": []
                                },
                                {
                                    "id": "about-divider",
                                    "type": "divider",
                                    "props": {
                                        "style": "solid",
                                        "thickness": 2,
                                        "color": "#e5e5e5",
                                        "marginY": 24
                                    },
                                    "children": []
                                },
                                {
                                    "id": "about-signature",
                                    "type": "text",
                                    "props": {
                                        "text": "<em>“Mangia bene, vivi felice.”</em><br><span class='text-muted'>Eat well, live happy.</span>",
                                        "align": "center",
                                        "className": "fs-5 text-center"
                                    },
                                    "children": []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "section-menu",
            "type": "section",
            "props": {
                "container": true,
                "paddingY": "py-5",
                "background": "#fff",
                "id": "menu",
                "className": "text-center"
            },
            "children": [
                {
                    "id": "menu-heading",
                    "type": "heading",
                    "props": {
                        "level": 2,
                        "text": "Our Menu",
                        "align": "center",
                        "className": "mb-4 text-center"
                    },
                    "children": []
                },
                {
                    "id": "menu-row",
                    "type": "row",
                    "props": {
                        "gutter": "g-4",
                        "className": "justify-content-center"
                    },
                    "children": [
                        {
                            "id": "menu-col1",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "sm": 6,
                                "md": 4,
                                "className": "d-flex justify-content-center"
                            },
                            "children": [
                                {
                                    "id": "menu-card1",
                                    "type": "card",
                                    "props": {
                                        "title": "Margherita Pizza",
                                        "subtitle": "Classic Neapolitan",
                                        "showHeader": true,
                                        "showFooter": false,
                                        "shadow": true,
                                        "className": "h-100 text-center"
                                    },
                                    "children": [
                                        {
                                            "id": "menu-img1",
                                            "type": "image",
                                            "props": {
                                                "src": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
                                                "alt": "Margherita Pizza",
                                                "width": "100%",
                                                "className": "mb-2 rounded"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "menu-desc1",
                                            "type": "text",
                                            "props": {
                                                "text": "San Marzano tomatoes, mozzarella, basil, extra virgin olive oil.",
                                                "align": "center",
                                                "className": "text-center"
                                            },
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "menu-col2",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "sm": 6,
                                "md": 4,
                                "className": "d-flex justify-content-center"
                            },
                            "children": [
                                {
                                    "id": "menu-card2",
                                    "type": "card",
                                    "props": {
                                        "title": "Tagliatelle al Tartufo",
                                        "subtitle": "Chef's Special",
                                        "showHeader": true,
                                        "showFooter": false,
                                        "shadow": true,
                                        "className": "h-100 text-center"
                                    },
                                    "children": [
                                        {
                                            "id": "menu-img2",
                                            "type": "image",
                                            "props": {
                                                "src": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
                                                "alt": "Tagliatelle al Tartufo",
                                                "width": "100%",
                                                "className": "mb-2 rounded"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "menu-desc2",
                                            "type": "text",
                                            "props": {
                                                "text": "Handmade tagliatelle, black truffle cream, parmesan.",
                                                "align": "center",
                                                "className": "text-center"
                                            },
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "menu-col3",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "sm": 6,
                                "md": 4,
                                "className": "d-flex justify-content-center"
                            },
                            "children": [
                                {
                                    "id": "menu-card3",
                                    "type": "card",
                                    "props": {
                                        "title": "Tiramisu",
                                        "subtitle": "Homemade Dessert",
                                        "showHeader": true,
                                        "showFooter": false,
                                        "shadow": true,
                                        "className": "h-100 text-center"
                                    },
                                    "children": [
                                        {
                                            "id": "menu-img3",
                                            "type": "image",
                                            "props": {
                                                "src": "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
                                                "alt": "Tiramisu",
                                                "width": "100%",
                                                "className": "mb-2 rounded"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "menu-desc3",
                                            "type": "text",
                                            "props": {
                                                "text": "Espresso-soaked ladyfingers, mascarpone, cocoa.",
                                                "align": "center",
                                                "className": "text-center"
                                            },
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "menu-link-row",
                    "type": "row",
                    "props": {
                        "gutter": "g-0",
                        "className": "mt-4 justify-content-center"
                    },
                    "children": [
                        {
                            "id": "menu-link-col",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 6,
                                "className": "text-center d-flex justify-content-center"
                            },
                            "children": [
                                {
                                    "id": "menu-link-btn",
                                    "type": "button",
                                    "props": {
                                        "label": "See Full Menu",
                                        "href": "https://example.com/menu.pdf",
                                        "className": "btn btn-outline-primary btn-lg",
                                        "target": "_blank"
                                    },
                                    "children": []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "section-testimonials",
            "type": "section",
            "props": {
                "container": true,
                "paddingY": "py-5",
                "background": "#f8fafc",
                "className": "text-center"
            },
            "children": [
                {
                    "id": "testimonials-heading",
                    "type": "heading",
                    "props": {
                        "level": 2,
                        "text": "What Our Guests Say",
                        "align": "center",
                        "className": "mb-4 text-center"
                    },
                    "children": []
                },
                {
                    "id": "testimonials-row",
                    "type": "row",
                    "props": {
                        "gutter": "g-4",
                        "className": "justify-content-center"
                    },
                    "children": [
                        {
                            "id": "testimonial-col-1",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 4,
                                "className": "d-flex justify-content-center"
                            },
                            "children": [
                                {
                                    "id": "testimonial-card-1",
                                    "type": "card",
                                    "props": {
                                        "showHeader": false,
                                        "showFooter": false,
                                        "shadow": true,
                                        "className": "text-center p-4 h-100"
                                    },
                                    "children": [
                                        {
                                            "id": "testimonial-text-1",
                                            "type": "text",
                                            "props": {
                                                "text": "“The best Italian food I've had outside of Italy! The pasta was perfectly cooked and the atmosphere was wonderful.”",
                                                "align": "center",
                                                "className": "fs-5 mb-3 text-center"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "testimonial-author-1",
                                            "type": "text",
                                            "props": {
                                                "text": "<strong>– Julia R.</strong>",
                                                "align": "center",
                                                "className": "text-muted text-center"
                                            },
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "testimonial-col-2",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 4,
                                "className": "d-flex justify-content-center"
                            },
                            "children": [
                                {
                                    "id": "testimonial-card-2",
                                    "type": "card",
                                    "props": {
                                        "showHeader": false,
                                        "showFooter": false,
                                        "shadow": true,
                                        "className": "text-center p-4 h-100"
                                    },
                                    "children": [
                                        {
                                            "id": "testimonial-text-2",
                                            "type": "text",
                                            "props": {
                                                "text": "“A hidden gem! The staff was so friendly and the tiramisu was out of this world.”",
                                                "align": "center",
                                                "className": "fs-5 mb-3 text-center"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "testimonial-author-2",
                                            "type": "text",
                                            "props": {
                                                "text": "<strong>– Mark D.</strong>",
                                                "align": "center",
                                                "className": "text-muted text-center"
                                            },
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "testimonial-col-3",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 4,
                                "className": "d-flex justify-content-center"
                            },
                            "children": [
                                {
                                    "id": "testimonial-card-3",
                                    "type": "card",
                                    "props": {
                                        "showHeader": false,
                                        "showFooter": false,
                                        "shadow": true,
                                        "className": "text-center p-4 h-100"
                                    },
                                    "children": [
                                        {
                                            "id": "testimonial-text-3",
                                            "type": "text",
                                            "props": {
                                                "text": "“We celebrated our anniversary here and everything was perfect. Highly recommend the truffle pasta!”",
                                                "align": "center",
                                                "className": "fs-5 mb-3 text-center"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "testimonial-author-3",
                                            "type": "text",
                                            "props": {
                                                "text": "<strong>– Emily & Sam</strong>",
                                                "align": "center",
                                                "className": "text-muted text-center"
                                            },
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "section-contact",
            "type": "section",
            "props": {
                "container": true,
                "paddingY": "py-5",
                "background": "#fff",
                "id": "contact",
                "className": "text-center"
            },
            "children": [
                {
                    "id": "contact-row",
                    "type": "row",
                    "props": {
                        "gutter": "g-4",
                        "classes": [
                            "text-center"
                        ],
                        "className": "justify-content-center"
                    },
                    "children": [
                        {
                            "id": "contact-col-info",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 6,
                                "className": "d-flex flex-column align-items-center"
                            },
                            "children": [
                                {
                                    "id": "contact-heading",
                                    "type": "heading",
                                    "props": {
                                        "level": 3,
                                        "text": "Contact & Reservations",
                                        "align": "center",
                                        "className": "text-center"
                                    },
                                    "children": []
                                },
                                {
                                    "id": "contact-info",
                                    "type": "text",
                                    "props": {
                                        "text": "<strong>Address:</strong> 123 Main Street, Cityville<br><strong>Phone:</strong> <a href='tel:+1234567890'>+1 234 567 890</a><br><strong>Email:</strong> <a href='mailto:info@latavola.com'>info@latavola.com</a><br><strong>Hours:</strong> Mon–Sun, 12pm–10pm",
                                        "align": "center",
                                        "className": "text-center"
                                    },
                                    "children": []
                                },
                                {
                                    "id": "contact-book-link-row",
                                    "type": "row",
                                    "props": {
                                        "gutter": "g-0",
                                        "className": "mt-3 justify-content-center"
                                    },
                                    "children": [
                                        {
                                            "id": "contact-book-link-col",
                                            "type": "col",
                                            "props": {
                                                "xs": 12,
                                                "className": "d-flex justify-content-center"
                                            },
                                            "children": [
                                                {
                                                    "id": "contact-book-link",
                                                    "type": "button",
                                                    "props": {
                                                        "label": "Book a Table Online",
                                                        "href": "https://resy.com/cities/ny/la-tavola",
                                                        "className": "btn btn-success btn-lg w-100",
                                                        "target": "_blank"
                                                    },
                                                    "children": []
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "section-footer",
            "type": "section",
            "props": {
                "background": "#212529",
                "paddingY": "py-4",
                "className": "text-center"
            },
            "children": [
                {
                    "id": "footer-text",
                    "type": "text",
                    "props": {
                        "text": "<span style='color:#fff;'>© 2025 La Tavola. Crafted with <span style='color:#e25555;'>♥</span> | <a href='#menu' style='color:#f8d90f;'>Menu</a></span>",
                        "align": "center",
                        "className": "text-center"
                    },
                    "children": []
                }
            ]
        }
    ]
}

// Templates

export const pageBuilderShopTemplate = () => {
    return [
        {
            "id": "navbar1",
            "type": "navbar",
            "props": {
                "brand": "MyShop",
                "menu": [
                    {
                        "label": "Home",
                        "href": "#"
                    },
                    {
                        "label": "Shop",
                        "href": "#shop"
                    },
                    {
                        "label": "Contact",
                        "href": "#contact"
                    }
                ],
                "sticky": true,
                "background": "#ffffff"
            },
            "children": []
        },
        {
            "id": "heroBanner",
            "type": "hero",
            "props": {
                "bgUrl": "https://placehold.co/1600x600?text=Welcome+to+MyShop",
                "title": "Welcome to MyShop",
                "subtitle": "Find Your Perfect Product",
                "height": 420,
                "overlay": 0.4,
                "align": "center",
                "textColor": "#ffffff"
            },
            "children": []
        },
        {
            "id": "productSection",
            "type": "section",
            "props": {
                "container": true,
                "paddingY": "py-5",
                "background": "#ffffff"
            },
            "children": [
                {
                    "id": "headingProducts",
                    "type": "heading",
                    "props": {
                        "text": "Featured Products",
                        "level": 2,
                        "align": "center"
                    },
                    "children": []
                },
                {
                    "id": "productsRow",
                    "type": "row",
                    "props": {
                        "gutter": "g-3"
                    },
                    "children": [
                        {
                            "id": "productCol1",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "sm": 6,
                                "md": 4,
                                "lg": 4
                            },
                            "children": [
                                {
                                    "id": "p1",
                                    "type": "product",
                                    "props": {
                                        "title": "Custom Mug",
                                        "price": "15.99",
                                        "oldPrice": "20.00",
                                        "rating": 5,
                                        "imgUrl": "https://placehold.co/300x200?text=Mug",
                                        "buyLabel": "Buy Now",
                                        "buyHref": "#mug"
                                    },
                                    "children": []
                                }
                            ]
                        },
                        {
                            "id": "productCol2",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "sm": 6,
                                "md": 4,
                                "lg": 4
                            },
                            "children": [
                                {
                                    "id": "p2",
                                    "type": "product",
                                    "props": {
                                        "title": "Gift Box",
                                        "price": "29.99",
                                        "oldPrice": "",
                                        "rating": 4,
                                        "imgUrl": "https://placehold.co/300x200?text=Gift+Box",
                                        "buyLabel": "Buy Now",
                                        "buyHref": "#giftbox"
                                    },
                                    "children": []
                                }
                            ]
                        },
                        {
                            "id": "productCol3",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "sm": 6,
                                "md": 4,
                                "lg": 4
                            },
                            "children": [
                                {
                                    "id": "p3",
                                    "type": "product",
                                    "props": {
                                        "title": "Keychain Set",
                                        "price": "9.99",
                                        "oldPrice": "12.00",
                                        "rating": 4,
                                        "imgUrl": "https://placehold.co/300x200?text=Keychain",
                                        "buyLabel": "Buy Now",
                                        "buyHref": "#keychain"
                                    },
                                    "children": []
                                }
                            ]
                        },
                        {
                            "id": "productCol4",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "sm": 6,
                                "md": 4,
                                "lg": 4
                            },
                            "children": [
                                {
                                    "id": "p4",
                                    "type": "product",
                                    "props": {
                                        "title": "Desk Organizer",
                                        "price": "19.99",
                                        "oldPrice": "25.00",
                                        "rating": 5,
                                        "imgUrl": "https://placehold.co/300x200?text=Organizer",
                                        "buyLabel": "Buy Now",
                                        "buyHref": "#organizer"
                                    },
                                    "children": []
                                }
                            ]
                        },
                        {
                            "id": "productCol5",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "sm": 6,
                                "md": 4,
                                "lg": 4
                            },
                            "children": [
                                {
                                    "id": "p5",
                                    "type": "product",
                                    "props": {
                                        "title": "Wooden Frame",
                                        "price": "12.50",
                                        "oldPrice": "15.00",
                                        "rating": 4,
                                        "imgUrl": "https://placehold.co/300x200?text=Frame",
                                        "buyLabel": "Buy Now",
                                        "buyHref": "#frame"
                                    },
                                    "children": []
                                }
                            ]
                        },
                        {
                            "id": "productCol6",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "sm": 6,
                                "md": 4,
                                "lg": 4
                            },
                            "children": [
                                {
                                    "id": "p6",
                                    "type": "product",
                                    "props": {
                                        "title": "Stylish Pen",
                                        "price": "7.99",
                                        "oldPrice": "10.00",
                                        "rating": 5,
                                        "imgUrl": "https://placehold.co/300x200?text=Pen",
                                        "buyLabel": "Buy Now",
                                        "buyHref": "#pen"
                                    },
                                    "children": []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "footerSection",
            "type": "section",
            "props": {
                "container": true,
                "paddingY": "py-4",
                "background": "#343a40"
            },
            "children": [
                {
                    "id": "footerText",
                    "type": "text",
                    "props": {
                        "text": "© 2025 MyShop. All Rights Reserved.",
                        "align": "center"
                    },
                    "children": []
                },
                {
                    "id": "footerLinks",
                    "type": "text",
                    "props": {
                        "text": "<a href='#privacy' style='color:white;'>Privacy Policy</a> | <a href='#terms' style='color:white;'>Terms & Conditions</a>",
                        "align": "center"
                    },
                    "children": []
                }
            ]
        }
    ]
}

export const pageBuilderRealStateTemplate = () => {
    return [
        {
            "id": "navbar-main",
            "type": "navbar",
            "props": {
                "brand": "Dhaka Realty",
                "menu": [
                    {
                        "label": "Home",
                        "href": "#"
                    },
                    {
                        "label": "Properties",
                        "href": "#properties"
                    },
                    {
                        "label": "About",
                        "href": "#about"
                    },
                    {
                        "label": "Contact",
                        "href": "#contact"
                    }
                ],
                "sticky": true,
                "background": "#206bc4"
            },
            "children": []
        },
        {
            "id": "hero-section",
            "type": "hero",
            "props": {
                "title": "Luxury 3-Bedroom Apartment in Downtown Dhaka",
                "subtitle": "Modern living with breathtaking city views and premium amenities.",
                "bgUrl": "https://shopemaa-platform-stage.ams3.digitaloceanspaces.com/shopemaa-platform-stage/177a1312-9c5a-40d7-a97b-5c66a4246f05/86537ced-11dc-4726-bad9-f9994b4c2b36-1724909805Ee55l.jpg",
                "height": 420,
                "overlay": 0.45,
                "align": "center",
                "textColor": "#ffffff",
                "className": "mb-0"
            },
            "children": [
                {
                    "id": "hero-cta-row",
                    "type": "row",
                    "props": {
                        "gutter": "g-2",
                        "className": "justify-content-center mt-4"
                    },
                    "children": [
                        {
                            "id": "hero-cta-col1",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "sm": 6,
                                "md": 4
                            },
                            "children": [
                                {
                                    "id": "hero-cta-btn",
                                    "type": "button",
                                    "props": {
                                        "label": "Book a Visit",
                                        "href": "#contact",
                                        "className": "btn btn-primary btn-lg w-100"
                                    },
                                    "children": []
                                }
                            ]
                        },
                        {
                            "id": "hero-cta-col2",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "sm": 6,
                                "md": 4
                            },
                            "children": [
                                {
                                    "id": "hero-cta-btn2",
                                    "type": "button",
                                    "props": {
                                        "label": "Download Brochure",
                                        "href": "#brochure",
                                        "className": "btn btn-outline-light btn-lg w-100"
                                    },
                                    "children": []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "section1",
            "type": "section",
            "props": {
                "container": true,
                "paddingY": "py-5",
                "background": "#ffffff"
            },
            "children": [
                {
                    "id": "row1",
                    "type": "row",
                    "props": {
                        "gutter": "g-4"
                    },
                    "children": [
                        {
                            "id": "col1",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 6
                            },
                            "children": [
                                {
                                    "id": "image1",
                                    "type": "image",
                                    "props": {
                                        "src": "https://shopemaa-platform-stage.ams3.digitaloceanspaces.com/shopemaa-platform-stage/177a1312-9c5a-40d7-a97b-5c66a4246f05/4c51f226-0324-40ed-a111-36dc32c17719-131b8c33-b3b4-415d-a2b2-44688ef6049d-1724909790GXuGK 1.jpg",
                                        "alt": "Property Image 1",
                                        "width": "100%"
                                    },
                                    "children": []
                                },
                                {
                                    "id": "image2",
                                    "type": "image",
                                    "props": {
                                        "src": "https://shopemaa-platform-stage.ams3.digitaloceanspaces.com/shopemaa-platform-stage/177a1312-9c5a-40d7-a97b-5c66a4246f05/f0c1a621-92a4-472f-a2b5-4241fb1ef1d5-1724909848E0dpW.jpg",
                                        "alt": "Property Image 2",
                                        "width": "100%",
                                        "className": "mt-3"
                                    },
                                    "children": []
                                },
                                {
                                    "id": "image3",
                                    "type": "image",
                                    "props": {
                                        "src": "https://shopemaa-platform-stage.ams3.digitaloceanspaces.com/shopemaa-platform-stage/177a1312-9c5a-40d7-a97b-5c66a4246f05/6dcd78ee-6625-4cc8-995e-92891be77525-1724909777rBmf6.jpg",
                                        "alt": "Property Image 3",
                                        "width": "100%",
                                        "className": "mt-3"
                                    },
                                    "children": []
                                }
                            ]
                        },
                        {
                            "id": "col2",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 6
                            },
                            "children": [
                                {
                                    "id": "heading1",
                                    "type": "heading",
                                    "props": {
                                        "text": "Luxury 3-Bedroom Apartment",
                                        "level": 2,
                                        "align": "left"
                                    },
                                    "children": []
                                },
                                {
                                    "id": "heading2",
                                    "type": "heading",
                                    "props": {
                                        "text": "Location: Downtown, Dhaka",
                                        "level": 4,
                                        "align": "left"
                                    },
                                    "children": []
                                },
                                {
                                    "id": "text1",
                                    "type": "text",
                                    "props": {
                                        "text": "This spacious 3-bedroom apartment offers premium finishes, modern kitchen, and stunning views of the city skyline. Amenities include a swimming pool, gym, and 24/7 security.",
                                        "align": "left"
                                    },
                                    "children": []
                                },
                                {
                                    "id": "property-details-list",
                                    "type": "text",
                                    "props": {
                                        "text": "<ul class='mb-3'><li>Area: 2,200 sq ft</li><li>3 Bedrooms, 3 Bathrooms</li><li>Modern Kitchen &amp; Dining</li><li>Private Balcony</li><li>2 Car Parking Spaces</li></ul>",
                                        "align": "left"
                                    },
                                    "children": []
                                },
                                {
                                    "id": "button1",
                                    "type": "button",
                                    "props": {
                                        "label": "Book a Visit",
                                        "href": "#contact",
                                        "className": "btn btn-primary"
                                    },
                                    "children": []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "section-features",
            "type": "section",
            "props": {
                "container": true,
                "paddingY": "py-5",
                "background": "#f6f8fb"
            },
            "children": [
                {
                    "id": "features-heading",
                    "type": "heading",
                    "props": {
                        "text": "Apartment Features",
                        "level": 3,
                        "align": "center",
                        "className": "mb-4"
                    },
                    "children": []
                },
                {
                    "id": "features-row",
                    "type": "row",
                    "props": {
                        "gutter": "g-4"
                    },
                    "children": [
                        {
                            "id": "feature-col1",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 4
                            },
                            "children": [
                                {
                                    "id": "feature-card1",
                                    "type": "card",
                                    "props": {
                                        "title": "Modern Kitchen",
                                        "showHeader": true,
                                        "showFooter": false,
                                        "shadow": true
                                    },
                                    "children": [
                                        {
                                            "id": "feature1-img",
                                            "type": "image",
                                            "props": {
                                                "src": "https://placehold.co/400x200?text=Kitchen",
                                                "alt": "Modern Kitchen",
                                                "width": "100%"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "feature1-desc",
                                            "type": "text",
                                            "props": {
                                                "text": "Fully equipped kitchen with premium appliances and elegant finishes.",
                                                "align": "left"
                                            },
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "feature-col2",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 4
                            },
                            "children": [
                                {
                                    "id": "feature-card2",
                                    "type": "card",
                                    "props": {
                                        "title": "Swimming Pool",
                                        "showHeader": true,
                                        "showFooter": false,
                                        "shadow": true
                                    },
                                    "children": [
                                        {
                                            "id": "feature2-img",
                                            "type": "image",
                                            "props": {
                                                "src": "https://placehold.co/400x200?text=Pool",
                                                "alt": "Swimming Pool",
                                                "width": "100%"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "feature2-desc",
                                            "type": "text",
                                            "props": {
                                                "text": "Enjoy a relaxing swim in the private residents-only pool.",
                                                "align": "left"
                                            },
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "feature-col3",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 4
                            },
                            "children": [
                                {
                                    "id": "feature-card3",
                                    "type": "card",
                                    "props": {
                                        "title": "24/7 Security",
                                        "showHeader": true,
                                        "showFooter": false,
                                        "shadow": true
                                    },
                                    "children": [
                                        {
                                            "id": "feature3-img",
                                            "type": "image",
                                            "props": {
                                                "src": "https://placehold.co/400x200?text=Security",
                                                "alt": "24/7 Security",
                                                "width": "100%"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "feature3-desc",
                                            "type": "text",
                                            "props": {
                                                "text": "Round-the-clock security and CCTV surveillance for your peace of mind.",
                                                "align": "left"
                                            },
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "section-location",
            "type": "section",
            "props": {
                "container": true,
                "paddingY": "py-5",
                "background": "#ffffff"
            },
            "children": [
                {
                    "id": "location-row",
                    "type": "row",
                    "props": {
                        "gutter": "g-4",
                        "align": "center"
                    },
                    "children": [
                        {
                            "id": "location-col-map",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 6
                            },
                            "children": [
                                {
                                    "id": "location-map",
                                    "type": "image",
                                    "props": {
                                        "src": "https://placehold.co/600x400?text=Map+Location",
                                        "alt": "Map Location",
                                        "width": "100%"
                                    },
                                    "children": []
                                }
                            ]
                        },
                        {
                            "id": "location-col-info",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 6
                            },
                            "children": [
                                {
                                    "id": "location-heading",
                                    "type": "heading",
                                    "props": {
                                        "text": "Prime Location",
                                        "level": 3,
                                        "align": "left"
                                    },
                                    "children": []
                                },
                                {
                                    "id": "location-desc",
                                    "type": "text",
                                    "props": {
                                        "text": "Located in the heart of Dhaka, this apartment offers easy access to shopping malls, schools, hospitals, and business districts. Experience the best of city living with everything at your doorstep.",
                                        "align": "left"
                                    },
                                    "children": []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "section-testimonials",
            "type": "section",
            "props": {
                "container": true,
                "paddingY": "py-5",
                "background": "#f6f8fb"
            },
            "children": [
                {
                    "id": "testimonials-heading",
                    "type": "heading",
                    "props": {
                        "text": "What Our Clients Say",
                        "level": 3,
                        "align": "center",
                        "className": "mb-4"
                    },
                    "children": []
                },
                {
                    "id": "testimonials-row",
                    "type": "row",
                    "props": {
                        "gutter": "g-4"
                    },
                    "children": [
                        {
                            "id": "testimonial-col1",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 6
                            },
                            "children": [
                                {
                                    "id": "testimonial-card1",
                                    "type": "card",
                                    "props": {
                                        "showHeader": false,
                                        "showFooter": false,
                                        "shadow": true
                                    },
                                    "children": [
                                        {
                                            "id": "testimonial-text1",
                                            "type": "text",
                                            "props": {
                                                "text": "“The apartment is stunning and the location is perfect for my family. The agent was professional and made the process seamless.”<br><strong>- Mrs. Rahman</strong>",
                                                "align": "left"
                                            },
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "testimonial-col2",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 6
                            },
                            "children": [
                                {
                                    "id": "testimonial-card2",
                                    "type": "card",
                                    "props": {
                                        "showHeader": false,
                                        "showFooter": false,
                                        "shadow": true
                                    },
                                    "children": [
                                        {
                                            "id": "testimonial-text2",
                                            "type": "text",
                                            "props": {
                                                "text": "“I love the amenities and the security. Highly recommend this property and the team at Dhaka Realty!”<br><strong>- Mr. Alam</strong>",
                                                "align": "left"
                                            },
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "section-contact",
            "type": "section",
            "props": {
                "container": true,
                "paddingY": "py-5",
                "background": "#ffffff"
            },
            "children": [
                {
                    "id": "contact-row",
                    "type": "row",
                    "props": {
                        "gutter": "g-4",
                        "align": "center"
                    },
                    "children": [
                        {
                            "id": "contact-col-agent",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 5
                            },
                            "children": [
                                {
                                    "id": "agent-card",
                                    "type": "card",
                                    "props": {
                                        "title": "Your Agent",
                                        "showHeader": true,
                                        "showFooter": false,
                                        "shadow": true,
                                        "className": "align-items-center"
                                    },
                                    "children": [
                                        {
                                            "id": "agent-img",
                                            "type": "image",
                                            "props": {
                                                "src": "https://placehold.co/120x120?text=Agent",
                                                "alt": "Agent Photo",
                                                "width": "150px",
                                                "className": "rounded-circle mb-2"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "agent-name",
                                            "type": "heading",
                                            "props": {
                                                "text": "Agent Tom",
                                                "level": 5,
                                                "align": "center"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "agent-contact",
                                            "type": "text",
                                            "props": {
                                                "text": "<strong>Phone:</strong> <a href='tel:+880123456789'>+880 1234 56789</a><br><strong>Email:</strong> <a href='mailto:imran@dhakarealty.com'>imran@dhakarealty.com</a>",
                                                "align": "center"
                                            },
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "section-footer",
            "type": "section",
            "props": {
                "background": "#206bc4",
                "paddingY": "py-4"
            },
            "children": [
                {
                    "id": "footer-text",
                    "type": "text",
                    "props": {
                        "text": "<span style='color:#fff'>© 2024 Dhaka Realty. All rights reserved.</span>",
                        "align": "center"
                    },
                    "children": []
                }
            ]
        }
    ]
}

export const pageBuilderProductPageTemplate = () => {
    return [
        {
            id: "section-main",
            type: "section",
            props: {
                container: true,
                paddingY: "py-6",
                background: "#ffffff"
            },
            children: [
                {
                    id: "row-main",
                    type: "row",
                    props: {
                        gutter: "g-4",
                        align: "center"
                    },
                    children: [
                        {
                            id: "col-image",
                            type: "col",
                            props: {
                                xs: 12,
                                md: 6
                            },
                            children: [
                                {
                                    id: "product-image",
                                    type: "image",
                                    props: {
                                        src: "https://placehold.co/600x600?text=Product+Image",
                                        alt: "Product Image",
                                        rounded: true,
                                        width: "100%",
                                        height: "auto"
                                    },
                                    children: []
                                }
                            ]
                        },
                        {
                            id: "col-details",
                            type: "col",
                            props: {
                                xs: 12,
                                md: 6
                            },
                            children: [
                                {
                                    id: "product-title",
                                    type: "heading",
                                    props: {
                                        level: 1,
                                        text: "Premium Leather Wallet"
                                    },
                                    children: []
                                },
                                {
                                    id: "product-subtitle",
                                    type: "text",
                                    props: {
                                        text: "Handcrafted luxury wallet with RFID protection."
                                    },
                                    children: []
                                },
                                {
                                    id: "product-price",
                                    type: "heading",
                                    props: {
                                        level: 3,
                                        text: "$39.99"
                                    },
                                    children: []
                                },
                                {
                                    id: "product-description",
                                    type: "text",
                                    props: {
                                        text: `- Genuine cowhide leather<br>- RFID blocking layer<br>- Multiple card slots<br>- Slim, stylish design`
                                    },
                                    children: []
                                },
                                {
                                    id: "cta-button",
                                    type: "button",
                                    props: {
                                        label: "Buy Now",
                                        href: "#checkout",
                                        size: "lg",
                                        variant: "primary"
                                    },
                                    children: []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: "section-footer",
            type: "section",
            props: {
                background: "#f8f9fa",
                paddingY: "py-4"
            },
            children: [
                {
                    id: "footer-text",
                    type: "text",
                    props: {
                        text: "© 2025 MyBrand. Powered by <a href='https://qrcentraal.com'>QrCentraal</a>",
                        align: "center"
                    },
                    children: []
                }
            ]
        }
    ]
}

export const pageBuilderCourseCreatorTemplate = () => {
    return [
        {
            "id": "navbar-main",
            "type": "navbar",
            "props": {
                "brand": "Crash Course",
                "menu": [
                    {
                        "label": "Home",
                        "href": "#"
                    },
                    {
                        "label": "Courses",
                        "href": "#courses"
                    },
                    {
                        "label": "About",
                        "href": "#about"
                    },
                    {
                        "label": "Contact",
                        "href": "#contact"
                    }
                ],
                "sticky": true,
                "background": "#206bc4"
            },
            "children": []
        },
        {
            "id": "hero-section",
            "type": "hero",
            "props": {
                "title": "Unlock Your Potential with Expert-Led Online Courses",
                "subtitle": "Join thousands of learners and master new skills at your own pace.",
                "bgUrl": "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1600&q=80",
                "height": 420,
                "overlay": 0.45,
                "align": "center",
                "textColor": "#fff",
                "className": "mb-0"
            },
            "children": [
                {
                    "id": "hero-cta-row",
                    "type": "row",
                    "props": {
                        "gutter": "g-3"
                    },
                    "children": [
                        {
                            "id": "hero-cta-col",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 8,
                                "className": "mx-auto"
                            },
                            "children": [
                                {
                                    "id": "hero-cta-btn",
                                    "type": "button",
                                    "props": {
                                        "label": "Browse Courses",
                                        "href": "#courses",
                                        "className": "btn btn-primary btn-lg px-4"
                                    },
                                    "children": []
                                },
                                {
                                    "id": "hero-cta-btn2",
                                    "type": "button",
                                    "props": {
                                        "label": "Get Free Guide",
                                        "href": "#signup",
                                        "className": "btn btn-outline-light btn-lg px-4 ms-2"
                                    },
                                    "children": []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "section-trusted",
            "type": "section",
            "props": {
                "container": true,
                "paddingY": "py-3",
                "background": "#f6f8fb"
            },
            "children": [
                {
                    "id": "trusted-row",
                    "type": "row",
                    "props": {
                        "gutter": "g-3",
                        "className": "align-items-center"
                    },
                    "children": [
                        {
                            "id": "trusted-col-text",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 4
                            },
                            "children": [
                                {
                                    "id": "trusted-heading",
                                    "type": "heading",
                                    "props": {
                                        "level": 4,
                                        "text": "Trusted by learners at"
                                    },
                                    "children": []
                                }
                            ]
                        },
                        {
                            "id": "trusted-col-logos",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 8
                            },
                            "children": [
                                {
                                    "id": "trusted-logos-row",
                                    "type": "row",
                                    "props": {
                                        "gutter": "g-2"
                                    },
                                    "children": [
                                        {
                                            "id": "logo4",
                                            "type": "col",
                                            "props": {
                                                "xs": 4,
                                                "md": 2
                                            },
                                            "children": [
                                                {
                                                    "id": "logo4-img",
                                                    "type": "image",
                                                    "props": {
                                                        "src": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
                                                        "alt": "Google",
                                                        "width": "80px",
                                                        "className": "d-block mx-auto"
                                                    },
                                                    "children": []
                                                }
                                            ]
                                        },
                                        {
                                            "id": "logo5",
                                            "type": "col",
                                            "props": {
                                                "xs": 4,
                                                "md": 2
                                            },
                                            "children": [
                                                {
                                                    "id": "logo5-img",
                                                    "type": "image",
                                                    "props": {
                                                        "src": "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
                                                        "alt": "Netflix",
                                                        "width": "80px",
                                                        "className": "d-block mx-auto"
                                                    },
                                                    "children": []
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "section-courses",
            "type": "section",
            "props": {
                "container": true,
                "paddingY": "py-6",
                "background": "#fff"
            },
            "children": [
                {
                    "id": "courses-heading",
                    "type": "heading",
                    "props": {
                        "level": 2,
                        "text": "Popular Courses",
                        "align": "center",
                        "className": "mb-4"
                    },
                    "children": []
                },
                {
                    "id": "courses-row",
                    "type": "row",
                    "props": {
                        "gutter": "g-4"
                    },
                    "children": [
                        {
                            "id": "course-col-1",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 4
                            },
                            "children": [
                                {
                                    "id": "course-card-1",
                                    "type": "card",
                                    "props": {
                                        "title": "Mastering React",
                                        "subtitle": "Beginner to Advanced",
                                        "showHeader": true,
                                        "showFooter": true,
                                        "footerText": "",
                                        "shadow": true,
                                        "className": "h-100"
                                    },
                                    "children": [
                                        {
                                            "id": "course-img-1",
                                            "type": "image",
                                            "props": {
                                                "src": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
                                                "alt": "React Course",
                                                "width": "100%",
                                                "className": "mb-3 rounded"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "course-desc-1",
                                            "type": "text",
                                            "props": {
                                                "text": "Build modern web apps with React, hooks, and state management. <br><b>Duration:</b> 8 weeks"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "course-footer-btn-1",
                                            "type": "button",
                                            "props": {
                                                "label": "Enroll Now",
                                                "href": "#",
                                                "className": "btn btn-primary w-100 mt-3"
                                            },
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "course-col-2",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 4
                            },
                            "children": [
                                {
                                    "id": "course-card-2",
                                    "type": "card",
                                    "props": {
                                        "title": "Digital Marketing 101",
                                        "subtitle": "Grow Your Audience",
                                        "showHeader": true,
                                        "showFooter": true,
                                        "footerText": "",
                                        "shadow": true,
                                        "className": "h-100"
                                    },
                                    "children": [
                                        {
                                            "id": "course-img-2",
                                            "type": "image",
                                            "props": {
                                                "src": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
                                                "alt": "Marketing Course",
                                                "width": "100%",
                                                "className": "mb-3 rounded"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "course-desc-2",
                                            "type": "text",
                                            "props": {
                                                "text": "Learn SEO, social media, and email marketing from industry experts. <br><b>Duration:</b> 6 weeks"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "course-footer-btn-2",
                                            "type": "button",
                                            "props": {
                                                "label": "Enroll Now",
                                                "href": "#",
                                                "className": "btn btn-primary w-100 mt-3"
                                            },
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "course-col-3",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 4
                            },
                            "children": [
                                {
                                    "id": "course-card-3",
                                    "type": "card",
                                    "props": {
                                        "title": "Python for Data Science",
                                        "subtitle": "Hands-on Projects",
                                        "showHeader": true,
                                        "showFooter": true,
                                        "footerText": "",
                                        "shadow": true,
                                        "className": "h-100"
                                    },
                                    "children": [
                                        {
                                            "id": "course-img-3",
                                            "type": "image",
                                            "props": {
                                                "src": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
                                                "alt": "Python Course",
                                                "width": "100%",
                                                "className": "mb-3 rounded"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "course-desc-3",
                                            "type": "text",
                                            "props": {
                                                "text": "Analyze real datasets and build ML models with Python. <br><b>Duration:</b> 10 weeks"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "course-footer-btn-3",
                                            "type": "button",
                                            "props": {
                                                "label": "Enroll Now",
                                                "href": "#",
                                                "className": "btn btn-primary w-100 mt-3"
                                            },
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "section-benefits",
            "type": "section",
            "props": {
                "container": true,
                "paddingY": "py-5",
                "background": "#f6f8fb"
            },
            "children": [
                {
                    "id": "benefits-heading",
                    "type": "heading",
                    "props": {
                        "level": 2,
                        "text": "Why Learn with SkillMastery?",
                        "align": "center",
                        "className": "mb-4"
                    },
                    "children": []
                },
                {
                    "id": "benefits-row",
                    "type": "row",
                    "props": {
                        "gutter": "g-4"
                    },
                    "children": [
                        {
                            "id": "benefit-col-1",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 4
                            },
                            "children": [
                                {
                                    "id": "benefit-card-1",
                                    "type": "card",
                                    "props": {
                                        "showHeader": false,
                                        "showFooter": false,
                                        "shadow": false,
                                        "className": "text-center border-0"
                                    },
                                    "children": [
                                        {
                                            "id": "benefit-title-1",
                                            "type": "heading",
                                            "props": {
                                                "level": 4,
                                                "text": "Expert Instructors",
                                                "align": "center"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "benefit-text-1",
                                            "type": "text",
                                            "props": {
                                                "text": "Learn from industry professionals with years of real-world experience.",
                                                "align": "center"
                                            },
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "benefit-col-2",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 4
                            },
                            "children": [
                                {
                                    "id": "benefit-card-2",
                                    "type": "card",
                                    "props": {
                                        "showHeader": false,
                                        "showFooter": false,
                                        "shadow": false,
                                        "className": "text-center border-0"
                                    },
                                    "children": [
                                        {
                                            "id": "benefit-title-2",
                                            "type": "heading",
                                            "props": {
                                                "level": 4,
                                                "text": "Flexible Learning",
                                                "align": "center"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "benefit-text-2",
                                            "type": "text",
                                            "props": {
                                                "text": "Access courses anytime, anywhere, and learn at your own pace.",
                                                "align": "center"
                                            },
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "benefit-col-3",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 4
                            },
                            "children": [
                                {
                                    "id": "benefit-card-3",
                                    "type": "card",
                                    "props": {
                                        "showHeader": false,
                                        "showFooter": false,
                                        "shadow": false,
                                        "className": "text-center border-0"
                                    },
                                    "children": [
                                        {
                                            "id": "benefit-title-3",
                                            "type": "heading",
                                            "props": {
                                                "level": 4,
                                                "text": "Certification",
                                                "align": "center"
                                            },
                                            "children": []
                                        },
                                        {
                                            "id": "benefit-text-3",
                                            "type": "text",
                                            "props": {
                                                "text": "Earn certificates to showcase your new skills to employers.",
                                                "align": "center"
                                            },
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "section-cta",
            "type": "section",
            "props": {
                "container": true,
                "paddingY": "py-5",
                "background": "#206bc4"
            },
            "children": [
                {
                    "id": "cta-row",
                    "type": "row",
                    "props": {
                        "gutter": "g-4",
                        "className": "align-items-center"
                    },
                    "children": [
                        {
                            "id": "cta-col-text",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 8
                            },
                            "children": [
                                {
                                    "id": "cta-heading",
                                    "type": "heading",
                                    "props": {
                                        "level": 3,
                                        "text": "Ready to start learning?",
                                        "align": "left",
                                        "className": "text-white mb-2"
                                    },
                                    "children": []
                                },
                                {
                                    "id": "cta-text",
                                    "type": "text",
                                    "props": {
                                        "text": "Sign up now and get instant access to all courses and resources.",
                                        "align": "left",
                                        "className": "text-white"
                                    },
                                    "children": []
                                }
                            ]
                        },
                        {
                            "id": "cta-col-btn",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 4,
                                "className": "text-md-end text-center"
                            },
                            "children": [
                                {
                                    "id": "cta-btn",
                                    "type": "button",
                                    "props": {
                                        "label": "Get Started",
                                        "href": "#signup",
                                        "className": "btn btn-light btn-lg"
                                    },
                                    "children": []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "section-newsletter",
            "type": "section",
            "props": {
                "container": true,
                "paddingY": "py-5",
                "background": "#f6f8fb"
            },
            "children": [
                {
                    "id": "newsletter-row",
                    "type": "row",
                    "props": {
                        "gutter": "g-3",
                        "className": "justify-content-center"
                    },
                    "children": [
                        {
                            "id": "newsletter-col",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 8
                            },
                            "children": [
                                {
                                    "id": "newsletter-form",
                                    "type": "form",
                                    "props": {
                                        "title": "Subscribe for Updates",
                                        "buttonLabel": "Subscribe",
                                        "placeholder": "Enter your email",
                                        "action": "#",
                                        "method": "POST",
                                        "className": "shadow-sm rounded bg-white p-4"
                                    },
                                    "children": []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "section-footer",
            "type": "section",
            "props": {
                "background": "#1b2431",
                "paddingY": "py-4"
            },
            "children": [
                {
                    "id": "footer-row",
                    "type": "row",
                    "props": {
                        "gutter": "g-2",
                        "className": "align-items-center"
                    },
                    "children": [
                        {
                            "id": "footer-col-left",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 6
                            },
                            "children": [
                                {
                                    "id": "footer-text",
                                    "type": "text",
                                    "props": {
                                        "text": "<span class='text-white'>© 2025 SkillMastery. All rights reserved.</span>",
                                        "align": "center"
                                    },
                                    "children": []
                                }
                            ]
                        },
                        {
                            "id": "footer-col-right",
                            "type": "col",
                            "props": {
                                "xs": 12,
                                "md": 6,
                                "className": "text-md-end text-center"
                            },
                            "children": [
                                {
                                    "id": "footer-links-row",
                                    "type": "row",
                                    "props": {
                                        "gutter": "g-2",
                                        "className": "justify-content-end"
                                    },
                                    "children": [
                                        {
                                            "id": "footer-link-privacy-col",
                                            "type": "col",
                                            "props": {
                                                "xs": 12,
                                                "md": "auto"
                                            },
                                            "children": [
                                                {
                                                    "id": "footer-link-privacy-btn",
                                                    "type": "button",
                                                    "props": {
                                                        "label": "Privacy Policy",
                                                        "href": "#privacy",
                                                        "className": "btn btn-link text-white px-0"
                                                    },
                                                    "children": []
                                                }
                                            ]
                                        },
                                        {
                                            "id": "footer-link-terms-col",
                                            "type": "col",
                                            "props": {
                                                "xs": 12,
                                                "md": "auto"
                                            },
                                            "children": [
                                                {
                                                    "id": "footer-link-terms-btn",
                                                    "type": "button",
                                                    "props": {
                                                        "label": "Terms of Service",
                                                        "href": "#terms",
                                                        "className": "btn btn-link text-white px-0"
                                                    },
                                                    "children": []
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
