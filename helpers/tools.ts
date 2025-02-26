// SPDX-FileCopyrightText: 2024 Deutsche Telekom AG, LlamaIndex, Vercel, Inc.
//
// SPDX-License-Identifier: MIT

import { red } from "picocolors";
import { TemplateFramework } from "./types";

export type Tool = {
  display: string;
  name: string;
  config?: Record<string, any>;
  dependencies?: ToolDependencies[];
  supportedFrameworks?: Array<TemplateFramework>;
};
export type ToolDependencies = {
  name: string;
  version?: string;
};

export const supportedTools: Tool[] = [
  {
    display: "Google Search (configuration required after installation)",
    name: "google.GoogleSearchToolSpec",
    config: {
      engine:
        "Your search engine id, see https://developers.google.com/custom-search/v1/overview#prerequisites",
      key: "Your search api key",
      num: 2,
    },
    dependencies: [
      {
        name: "llama-index-tools-google",
        version: "0.1.2",
      },
    ],
    supportedFrameworks: ["fastapi"],
  },
  {
    display: "Brave Search (configuration required after installation)",
    name: "brave_search.BraveSearchToolSpec",
    config: {
      api_key: "Your Brave search API key, see https://brave.com/search/api",
    },
    dependencies: [
      {
        name: "llama-index-tools-brave-search",
        version: "0.1.0",
      },
    ],
  },
  {
    display: "DuckDuckGo Search",
    name: "duckduckgo.DuckDuckGoSearchToolSpec",
    dependencies: [
      {
        name: "llama-index-tools-duckduckgo",
        version: "0.1.0",
      },
    ],
  },
  {
    display: "Wikipedia",
    name: "wikipedia.WikipediaToolSpec",
    dependencies: [
      {
        name: "llama-index-tools-wikipedia",
        version: "0.1.2",
      },
    ],
    supportedFrameworks: ["fastapi", "express", "nextjs"],
  },
];

export const getTool = (toolName: string): Tool | undefined => {
  return supportedTools.find((tool) => tool.name === toolName);
};

export const getTools = (toolsName: string[]): Tool[] => {
  const tools: Tool[] = [];
  for (const toolName of toolsName) {
    const tool = getTool(toolName);
    if (!tool) {
      console.log(
        red(
          `Error: Tool '${toolName}' is not supported. Supported tools are: ${supportedTools
            .map((t) => t.name)
            .join(", ")}`,
        ),
      );
      process.exit(1);
    }
    tools.push(tool);
  }
  return tools;
};

export const toolsRequireConfig = (tools?: Tool[]): boolean => {
  if (tools) {
    return tools?.some((tool) => Object.keys(tool.config || {}).length > 0);
  }
  return false;
};
