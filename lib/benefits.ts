import benefitsData from './benefits.json';

export interface BenefitMetadata {
    title: string;
    description: string;
    keywords: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface BenefitImage {
    src: string;
    alt: string;
    caption?: string;
    title?: string;
    width?: number;
    height?: number;
    position?: 'before' | 'after';
}

export interface BenefitSection {
    id?: string;
    heading?: string;
    content: string;
    images?: BenefitImage[];
}

export interface Benefit {
    slug: string;
    title: string;
    tagline: string;
    icon: string;
    image: string;
    imageAlt: string;
    order: number;
    metadata: BenefitMetadata;
    hero: {
        heading: string;
        subheading: string;
    };
    sections: BenefitSection[];
    faqs?: FAQ[];
}

export function getAllBenefits(): Benefit[] {
    return (benefitsData as Benefit[])
        .slice()
        .sort((a, b) => a.order - b.order);
}

export function getBenefitBySlug(slug: string): Benefit | undefined {
    return (benefitsData as Benefit[]).find((benefit) => benefit.slug === slug);
}
