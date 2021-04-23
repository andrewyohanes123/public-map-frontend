export const svgColor = (icon: string, color: string) => {
  const head = icon.split(',')[0];
  const data = icon.split(',')[1];
  const dom = new DOMParser();
  const svg = dom.parseFromString(atob(data), 'image/svg+xml');
  if (svg !== null) {
    //@ts-ignore
    svg.firstChild!.setAttribute('fill', color);
    const colored = new XMLSerializer().serializeToString(svg.documentElement);
    return head + ',' + btoa(colored);
  }
}