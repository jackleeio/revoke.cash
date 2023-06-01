import DangerousProse from 'components/common/DangerousProse';
import matter from 'gray-matter';
import LearnLayout from 'layouts/LearnLayout';
import { ISidebarEntry } from 'lib/interfaces';
import { getAllContentSlugs, getSidebar, markdownToHtml, readContentFile } from 'lib/utils/markdown';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

interface Props {
  meta: Record<string, any>;
  content: string;
  sidebar: ISidebarEntry[];
  slug: string[];
}

const LearnDocumentPage: NextPage<Props> = ({ meta, content, sidebar, slug }) => {
  return (
    <LearnLayout sidebarEntries={sidebar} slug={slug} title={meta.sidebar_title}>
      <DangerousProse content={content} />
    </LearnLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const fileContent = readContentFile(params.slug, locale);
  const { data: meta, content: markdown } = matter(fileContent);
  const content = markdownToHtml(markdown);
  const sidebar = await getSidebar(locale, 'learn');

  return {
    props: {
      meta,
      content,
      sidebar,
      slug: params.slug,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const slugs = getAllContentSlugs('learn');

  const paths = locales.flatMap((locale) =>
    slugs.map((slug) => ({
      params: { slug },
      locale,
    }))
  );

  return {
    paths,
    fallback: false,
  };
};

export default LearnDocumentPage;