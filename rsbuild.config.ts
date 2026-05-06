import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSvgr } from "@rsbuild/plugin-svgr";
import { VanillaExtractPlugin } from "@vanilla-extract/webpack-plugin";
import { tanstackRouter } from "@tanstack/router-plugin/rspack";

export default defineConfig({
  html: {
    title: "Tauri Tanstack Starter",
  },
  plugins: [
    pluginReact({
      reactRefreshOptions: {
        exclude: [/\.css\.ts$/],
      },
    }),
    pluginSvgr(),
  ],
  source: {
    entry: {
      index: "./src-ts/main.tsx",
    },
  },
  splitChunks: {
    cacheGroups: {
      vanilla: {
        test: /@vanilla-extract\/webpack-plugin/,
        // make sure that chunks containing modules created by @vanilla-extract/webpack-plugin have stable IDs
        // in development mode to avoid HMR issues
        name: process.env.NODE_ENV === "development" && "vanilla",
        chunks: "all",
      },
    },
  },
  tools: {
    rspack: {
      plugins: [
        new VanillaExtractPlugin(),
        tanstackRouter({
          target: "react",
          autoCodeSplitting: true,
          generatedRouteTree: "./src-ts/routeTree.gen.ts",
          routesDirectory: "./src-ts/routes",
        }),
      ],
    },
  },
});
