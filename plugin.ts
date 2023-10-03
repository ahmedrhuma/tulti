import { IApi } from 'umi';

export default (api: IApi) => {
  api.addHTMLMetas(() => [{
    content: "#002140",
    name: "apple-mobile-web-app-status-bar"
  }]);

  api.addHTMLLinks(() => [
    {
        rel: "apple-touch-icon",
        href: "/icons/icon-128x128.png"
    },
    {
        rel: "manifest",
        href: "/manifest.json"
    }
  ])
};