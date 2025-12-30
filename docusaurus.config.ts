import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {

  title: 'Stop believing. Start understanding.',
  tagline: 'Debunking Kubernetes myths with real-world cluster validation, experiments, and operational insights.',
  favicon: 'img/favicon.ico',


  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://kubernetesmyths.com',

  baseUrl: process.env.BASE_URL || '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'kubernetes-myths', // Usually your GitHub org/user name.
  projectName: 'website', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  onBrokenLinks: 'throw',


  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.

          editUrl:
            'https://github.com/kubernetes-myths/website/blob/main/',
        },

        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],



  themeConfig: {
    // Replace with your project's social card
    image: 'img/kubernetesmyths.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Kubernetes Myths',
      logo: {
        alt: 'Kubernetes Myths Logo',
        src: 'img/kubernetesmyths.png',
      },
      items: [

        {
          label: 'K8s Core Myths',
          type: 'docSidebar',
          sidebarId: 'k8sCoreMythsSidebar',
          position: 'left',

        },
        {
          label: 'K8s Ecosystem Myths',
          type: 'docSidebar',
          sidebarId: 'k8sEcosystemMythsSidebar',
          position: 'left',

        },

        {
          label: 'K8s Platform Myths',
          type: 'docSidebar',
          sidebarId: 'k8sPlatformMythsSidebar',
          position: 'left',

        },


        {
          label: 'K8s Domain Myths',
          type: 'docSidebar',
          sidebarId: 'k8sDomainMythsSidebar',
          position: 'left',

        },
        { to: '/the-kubernetes-mythologist', label: 'The Kubernetes Mythologist', position: 'right' },
        {
          href: 'https://github.com/kubernetes-myths/website',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Kubernetes Myths',
          items: [
            {
              label: 'Architecture Myths',
              to: '/category/architecture-myths',
            },
            {
              label: 'Workload Myths',
              to: '/category/workload-myths',
            },
            {
              label: 'Networking Myths',
              to: '/category/networking-myths',
            },
            {
              label: 'Storage Myths',
              to: '/category/storage-myths',
            },
            {
              label: 'Security Myths',
              to: '/category/security-myths',
            },
          ],
        },
        {
          title: 'The Kubernetes Mythologist',
          items: [
            {
              label: 'Linkedin',
              href: 'https://www.linkedin.com/in/rajesh-deshpande-1058b9151/',
            },
            {
              label: 'Github',
              href: 'https://github.com/rajeshd2091',
            },

          ],
        },

      ],
      copyright: `Copyright © ${new Date().getFullYear()} Kubernetes Myths.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

//export default config;
module.exports = config; 
