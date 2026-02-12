export const componentSchema = [
  {
    name: "Navbar",
    description: "A top navigation header. Always place this at the very top of the layout.",
    props: {
      title: { type: "string", description: "The name of the application displayed on the left." },
      children: { type: "node", description: "Buttons or links to display on the right side." }
    }
  },
  {
    name: "Container",
    description: "A layout wrapper to stack or align multiple components.",
    props: {
      direction: { type: "string", allowedValues: ["row", "column"], description: "Defaults to column" },
      align: { type: "string", allowedValues: ["start", "center", "end"] },
      gap: { type: "string", allowedValues: ["small", "medium", "large"] },
      children: { type: "node" }
    }
  },
  {
    name: "Button",
    description: "A clickable button element. Used for user actions.",
    props: {
      variant: { type: "string", allowedValues: ["primary", "secondary", "destructive"] },
      children: { type: "string" }
    }
  },
  {
    name: "Card",
    description: "A container for grouping related content.",
    props: {
      title: { type: "string", description: "Optional heading" },
      children: { type: "node" }
    }
  },
  {
    name: "Input",
    description: "A text input field for forms.",
    props: {
      type: { type: "string", allowedValues: ["text", "email", "password"] },
      placeholder: { type: "string" },
      label: { type: "string", description: "Text label above the input" }
    }
  },
  {
    name: "Sidebar",
    description: "A vertical navigation panel. Use this inside a Container with direction='row' to make a dashboard layout.",
    props: {
      children: { type: "node", description: "Navigation links or buttons." }
    }
  },
  {
    name: "Modal",
    description: "A popup dialog overlay. Use this for confirmations or settings forms.",
    props: {
      title: { type: "string", description: "The header title of the modal." },
      isOpen: { type: "boolean", description: "Defaults to true to show the modal." },
      children: { type: "node", description: "The content inside the modal." }
    }
  },
  {
    name: "Chart",
    description: "A visual graph component for displaying data.",
    props: {
      title: { type: "string", description: "The chart title (e.g., 'Revenue')." },
      type: { type: "string", allowedValues: ["bar", "line"] },
      data: { type: "array", description: "Optional array of numbers (0-100)." }
    }
  }
];

export const schemaPromptText = JSON.stringify(componentSchema, null, 2);