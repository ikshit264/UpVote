import featuresData from './features.json';

export interface FeatureMetadata {
    title: string;
    description: string;
    keywords: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface FeatureImage {
    src: string;
    alt: string;
    caption?: string;
    title?: string;
    width?: number;
    height?: number;
    position?: 'before' | 'after';
}

export interface FeatureSection {
    id?: string;
    heading?: string;
    content: string;
    images?: FeatureImage[];
}

export interface Feature {
    slug: string;
    title: string;
    tagline: string;
    icon: string;
    image: string;
    imageAlt: string;
    order: number;
    metadata: FeatureMetadata;
    hero: {
        heading: string;
        subheading: string;
    };
    sections: FeatureSection[];
    faqs?: FAQ[];
}

export function getAllFeatures(): Feature[] {
    return (featuresData as Feature[])
        .slice()
        .sort((a, b) => a.order - b.order);
}

export function getFeatureBySlug(slug: string): Feature | undefined {
    return (featuresData as Feature[]).find((feature) => feature.slug === slug);
}
