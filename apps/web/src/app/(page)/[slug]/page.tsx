import { notFound } from 'next/navigation';
import { PageService } from '@libs/react-shared';
import { DynamicPageClient } from '@web/sections/page/page';

type DynamicPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

const pageService = PageService.getInstance<PageService>();

export default async function DynamicPage({ params }: DynamicPageProps) {
    const { slug } = await params;
    let page;
    try {
        page = await pageService.getPageBySlug(slug);
    } catch (e) {
        console.error(e);
    }

    if (!page) {
        notFound();
    }

    return <DynamicPageClient page={page} />;
}

export async function generateMetadata({ params }: DynamicPageProps) {
    const { slug } = await params;

    const page = await pageService.getPageBySlug(slug);

    if (!page) {
        return {
            title: 'Page Not Found',
        };
    }

    const metaData = page.metaData;
    const title = metaData?.pageTitle || page.title || 'Page';
    const description = metaData?.meta?.find(m => m.key === 'description')?.value || page.content?.substring(0, 160);

    return {
        title,
        description,
    };
}
