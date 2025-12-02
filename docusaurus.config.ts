import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
 // title: 'Kubernetes Myths',
  title : 'Debunking Kubernetes misconceptions with proofs, experiments, and real-world validation.',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',


  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://kubernetesmyths.com',

  baseUrl: '/',

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
          type: 'docSidebar',
          sidebarId: 'architectureSidebar',
          position: 'left',
          label: 'Architecture Myths',
        },
         {
          type: 'docSidebar',
          sidebarId: 'workloadSidebar',
          position: 'left',
          label: 'Workload Myths',
        },
        
         {
          type: 'docSidebar',
          sidebarId: 'networkingSidebar',
          position: 'left',
          label: 'Networking Myths',
        },
        {
          type: 'docSidebar',
          sidebarId: 'storageSidebar',
          position: 'left',
          label: 'Storage Myths',
        },
        {
          type: 'docSidebar',
          sidebarId: 'securitySidebar',
          position: 'left',
          label: 'Security Myths',
        },
       
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
              to: '/architecture-myths/overview',
            },
             {
              label: 'Workload Myths',
              to: '/workload_myths/overview',
            },
             {
              label: 'Networking Myths',
              to: '/networking_myths/overview',
            },
             {
              label: 'Storage Myths',
              to: '/storage_myths/overview',
            },
             {
              label: 'Security Myths',
              to: '/security_myths/overview',
            },
          ],
        },
        {
          title: 'Author',
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
