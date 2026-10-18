import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cldSrcSet, cldUrl } from '../../lib/cloudinary';
import { defaultColor, pickSize } from '../../lib/variants';
import { trackEvent } from '../../utils/FacebookPixel';
import { offerPrice, offerSaving } from '../offers';
import LiliaOrderForm from './LiliaOrderForm';
import { content, images, FACEBOOK_PAGE, SHOP_PHONE } from './content';
import './lilia.css';

// Keep in sync with the hero preload in index.html
const HERO_SIZES = '(min-width: 900px) 420px, 92vw';

const scrollGently = (element, block = 'start') => {
    if (!element) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block });
};

const colorLabel = (color) => content.colorLabels[color?.name] || color?.name || '';
const allSizes = (product) => [...new Set((product.colors || []).flatMap((color) => (color.sizes || []).map((size) => size.value)))];
// The photo of a colour: the page's own picture if it has one, otherwise the product's
const colorPhoto = (color) => content.colorPhotos[color?.name] || color?.images?.[0]?.url || '';

const TruckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
        <path d="M2.6 6.6h10.4v9H2.6z" /><path d="M13 9.6h3.8l2.7 3v3H13z" />
        <circle cx="7" cy="17.6" r="1.8" /><circle cx="16.4" cy="17.6" r="1.8" />
    </svg>
);

// "Ensemble Lilia" landing page (Fares Atelier). Written for the phone first:
// one column, big tap targets, and a bar that follows her to the form once the hero is gone.
const LiliaLanding = ({ slug, product }) => {
    // One entry per piece of the chosen pack, each with its own color and size
    const [items, setItems] = useState(() => {
        // The color of the hero photo comes first, as long as it is in stock
        const wanted = (product.colors || []).find((color) => color.name === content.defaultColorName);
        const color = (wanted && pickSize(wanted) ? wanted : defaultColor(product.colors));
        return Array.from({ length: content.defaultPack }, () => ({ color, size: pickSize(color) }));
    });
    const addToCartSent = useRef(false);
    const heroRef = useRef(null);
    const formRef = useRef(null);
    const [showSticky, setShowSticky] = useState(false);

    const quantity = items.length;
    const packPrice = offerPrice(product, quantity);
    const heroColor = items[0]?.color;
    // The photo of the colour the page opens on — the same file index.html preloaded
    const heroPhoto = colorPhoto((product.colors || []).find((color) => color.name === content.defaultColorName))
        || colorPhoto(product.colors?.[0])
        || product.images?.[0]?.url
        || '';

    // The customer choosing a pack, color or size herself is the "add to cart" moment
    const sendAddToCart = useCallback((count) => {
        if (addToCartSent.current) return;
        addToCartSent.current = true;
        trackEvent('AddToCart', {
            content_ids: [product._id],
            content_name: product.title,
            content_type: 'product',
            currency: 'DZD',
            value: offerPrice(product, count),
            num_items: count,
        });
    }, [product]);

    const choosePack = (count) => {
        setItems((prev) => (count > prev.length
            ? [...prev, ...Array.from({ length: count - prev.length }, () => prev[prev.length - 1])]
            : prev.slice(0, count)));
        sendAddToCart(count);
    };

    const chooseColor = (index, color) => {
        setItems((prev) => prev.map((item, i) => (i === index ? { color, size: pickSize(color, item.size?.value) } : item)));
        sendAddToCart(quantity);
    };

    const chooseSize = (index, size) => {
        setItems((prev) => prev.map((item, i) => (i === index ? { ...item, size } : item)));
        sendAddToCart(quantity);
    };

    const handleSizeMissing = useCallback((index) => {
        const select = document.getElementById(`checkout-size-${index}`);
        scrollGently(select, 'center');
        select?.focus({ preventScroll: true });
    }, []);

    const scrollToForm = () => scrollGently(formRef.current);

    // The colors for sale, then the ones that are finished (shown, never orderable)
    const sortedColors = [...(product.colors || [])].sort(
        (a, b) => content.colorOrder.indexOf(a.name) - content.colorOrder.indexOf(b.name),
    );
    const colorCards = [
        ...sortedColors.map((color) => ({
            key: color.name,
            label: colorLabel(color),
            image: colorPhoto(color),
            soldOut: (color.sizes || []).every((size) => Number(size.stock) <= 0),
        })),
        ...content.soldOutColors.map((color) => ({ key: color.label, label: color.label, image: color.image, soldOut: true })),
    ];

    useEffect(() => {
        document.title = `${content.pageTitle} — ${content.brand}`;
    }, []);

    // The phone bar: on once the hero has scrolled away, off again over the form itself
    useEffect(() => {
        const hero = heroRef.current;
        const form = formRef.current;
        if (!hero || !form || typeof IntersectionObserver === 'undefined') return undefined;

        const seen = { hero: true, form: false };
        const update = () => setShowSticky(!seen.hero && !seen.form);
        const watch = (element, key) => {
            const observer = new IntersectionObserver(([entry]) => {
                seen[key] = entry.isIntersecting;
                update();
            }, { rootMargin: '0px 0px -10% 0px' });
            observer.observe(element);
            return observer;
        };
        const observers = [watch(hero, 'hero'), watch(form, 'form')];
        return () => observers.forEach((observer) => observer.disconnect());
    }, []);

    return (
        <div className="li-page" dir="rtl">
            {/* Hero */}
            <header className="li-hero" ref={heroRef}>
                {images.logo
                    ? <img className="li-logo" src={cldUrl(images.logo, 480)} width="200" height="125" alt={content.brand} />
                    : <p className="li-wordmark">{content.brand}</p>}
                <h1>{content.title}</h1>
                <p className="li-subtitle">{content.subtitle}</p>
                {heroPhoto && (
                    <img
                        className="li-hero-photo"
                        src={cldUrl(heroPhoto, 640)}
                        srcSet={cldSrcSet(heroPhoto)}
                        sizes={HERO_SIZES}
                        alt={`${product.title} — ${colorLabel(heroColor)}`}
                        fetchPriority="high"
                        decoding="async"
                    />
                )}
                <span className="li-price">{product.price} دج</span>
                <span className="li-price-note">{content.priceNote}</span>
                <button type="button" className="li-btn li-btn-rose" onClick={scrollToForm}>{content.cta}</button>
                <p className="li-note"><TruckIcon /> {content.deliveryNote}</p>
            </header>

            {/* Colors */}
            <section className="li-section" aria-labelledby="li-colors-title">
                <h2 id="li-colors-title">{content.colorsTitle}</h2>
                <div className="li-colors">
                    {colorCards.map((card) => (
                        <figure key={card.key} className={`li-color-card${card.soldOut ? ' is-out' : ''}`}>
                            {card.image && (
                                <img
                                    src={cldUrl(card.image, 480)}
                                    srcSet={cldSrcSet(card.image, [320, 480, 640])}
                                    sizes="(min-width: 900px) 240px, 45vw"
                                    alt={`${product.title} — ${card.label}`}
                                    loading="lazy"
                                    decoding="async"
                                />
                            )}
                            <figcaption>
                                <span className="li-color-name">{card.label}</span>
                                <span className={`li-tag${card.soldOut ? ' is-out' : ''}`}>
                                    {card.soldOut ? content.soldOutLabel : content.inStockLabel}
                                </span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </section>

            {/* Sizes */}
            <section className="li-section" aria-labelledby="li-sizes-title">
                <h2 id="li-sizes-title">{content.sizesTitle}</h2>
                <ul className="li-sizes">
                    {allSizes(product).map((size) => <li key={size}>{size}</li>)}
                </ul>
                <p className="li-muted">{content.sizesNote}</p>
            </section>

            {/* Offers */}
            <section className="li-section" aria-labelledby="li-offers-title">
                <h2 id="li-offers-title">{content.offersTitle}</h2>
                <div className="li-offers">
                    {content.packs.map((pack) => {
                        const price = offerPrice(product, pack.quantity);
                        const saving = offerSaving(product, pack.quantity);
                        const selected = pack.quantity === quantity;
                        return (
                            <button
                                key={pack.quantity}
                                type="button"
                                className={`li-offer${selected ? ' is-selected' : ''}`}
                                aria-pressed={selected}
                                onClick={() => choosePack(pack.quantity)}
                            >
                                <span className="li-offer-name">{pack.label}</span>
                                <span className="li-offer-price">{price} دج</span>
                                {saving > 0 && <span className="li-offer-save">وفّري {saving} دج مقارنة بالشراء المنفصل</span>}
                            </button>
                        );
                    })}
                </div>
                <button type="button" className="li-btn li-btn-rose" onClick={scrollToForm}>{content.offersCta}</button>
            </section>

            {/* Why you'll love it */}
            <section className="li-section" aria-labelledby="li-features-title">
                <h2 id="li-features-title">{content.featuresTitle}</h2>
                <p className="li-muted">{content.featuresIntro}</p>
                <div className="li-features">
                    {content.features.map((feature) => (
                        <article key={feature.title} className="li-feature">
                            <h3>{feature.title}</h3>
                            <p>{feature.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Gallery — only when extra photos are added to content.js */}
            {content.gallery.length > 0 && (
            <section className="li-section li-section-wide" aria-labelledby="li-gallery-title">
                <h2 id="li-gallery-title">{content.galleryTitle}</h2>
                <div className="li-gallery">
                    {content.gallery.map((image, index) => (
                        <img
                            key={image}
                            src={cldUrl(image, 480)}
                            srcSet={cldSrcSet(image, [320, 480, 640])}
                            sizes="(min-width: 900px) 260px, 60vw"
                            alt={`${content.brand} ${index + 1}`}
                            loading="lazy"
                            decoding="async"
                        />
                    ))}
                </div>
            </section>
            )}

            {/* Order form */}
            <section id="order" ref={formRef} className="li-order" aria-labelledby="li-form-title">
                <h2 id="li-form-title">{content.formTitle}</h2>
                <p className="li-muted">{content.formSubtitle}</p>
                <LiliaOrderForm
                    slug={slug}
                    product={product}
                    items={items}
                    packPrice={packPrice}
                    onPack={choosePack}
                    onColor={chooseColor}
                    onSize={chooseSize}
                    onSizeMissing={handleSizeMissing}
                />
            </section>

            {/* FAQ */}
            <section className="li-section" aria-labelledby="li-faq-title">
                <h2 id="li-faq-title">{content.faqTitle}</h2>
                <div className="li-faq">
                    {content.faq.map((entry) => (
                        <details key={entry.q}>
                            <summary>
                                <span>{entry.q}</span>
                                <span className="li-faq-sign" aria-hidden="true">+</span>
                            </summary>
                            <p>{entry.a}</p>
                        </details>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="li-footer">
                {images.logo
                    ? <img src={cldUrl(images.logo, 320)} width="140" height="88" alt={content.brand} loading="lazy" />
                    : <p className="li-wordmark li-wordmark-small">{content.brand}</p>}
                <p>{content.tagline}</p>
                <p className="li-footer-links">
                    <a href={`tel:${SHOP_PHONE}`} dir="ltr">{SHOP_PHONE}</a>
                    {' · '}
                    {FACEBOOK_PAGE && <><a href={FACEBOOK_PAGE}>فيسبوك</a>{' · '}</>}
                    <Link to="/confidentialite">سياسة الخصوصية</Link>
                </p>
                <p className="li-copy">© {content.brand} {new Date().getFullYear()}</p>
            </footer>

            {/* Phone only: the price and the way back to the form */}
            <div className={`li-sticky${showSticky ? ' is-on' : ''}`} aria-hidden={!showSticky}>
                <div className="li-sticky-price">
                    <b>{packPrice} دج</b>
                    <span>{content.packs.find((pack) => pack.quantity === quantity)?.label}</span>
                </div>
                <button type="button" className="li-btn li-btn-rose" tabIndex={showSticky ? 0 : -1} onClick={scrollToForm}>
                    {content.stickyCta}
                </button>
            </div>
        </div>
    );
};

export default LiliaLanding;
