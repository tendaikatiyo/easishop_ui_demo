import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function SocialSvg({
  size = 16,
  children,
  ...props
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export function TikTokIcon({ size = 16, ...props }: IconProps) {
  return (
    <SocialSvg size={size} {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.16 15.84 6.34 6.34 0 0 0 9.5 22.18a6.34 6.34 0 0 0 6.34-6.34V8.73a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-.01-.15Z" />
    </SocialSvg>
  );
}

export function InstagramIcon({ size = 16, ...props }: IconProps) {
  return (
    <SocialSvg size={size} {...props}>
      <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.92A3.12 3.12 0 1 1 12 8.88a3.12 3.12 0 0 1 0 6.24Z" />
      <path d="M16.98 2H7.02A5.03 5.03 0 0 0 2 7.02v9.96A5.03 5.03 0 0 0 7.02 22h9.96A5.03 5.03 0 0 0 22 16.98V7.02A5.03 5.03 0 0 0 16.98 2Zm3.3 14.98a3.31 3.31 0 0 1-3.3 3.3H7.02a3.31 3.31 0 0 1-3.3-3.3V7.02a3.31 3.31 0 0 1 3.3-3.3h9.96a3.31 3.31 0 0 1 3.3 3.3v9.96Z" />
      <circle cx="17.52" cy="6.48" r="1.2" />
    </SocialSvg>
  );
}

export function FacebookIcon({ size = 16, ...props }: IconProps) {
  return (
    <SocialSvg size={size} {...props}>
      <path d="M14 9h3V6h-3c-1.66 0-3 1.57-3 3.5V12H8v3h3v7h3v-7h2.5l.5-3H14V9.5c0-.28.22-.5.5-.5H14Z" />
    </SocialSvg>
  );
}

export function LinkedInIcon({ size = 16, ...props }: IconProps) {
  return (
    <SocialSvg size={size} {...props}>
      <path d="M6.34 9.25H3.5v11.25h2.84V9.25ZM4.92 3.5a1.72 1.72 0 1 0 0 3.44 1.72 1.72 0 0 0 0-3.44ZM20.5 13.07c0-2.68-1.7-3.96-3.4-3.96-1.25 0-2.18.65-2.57 1.3h-.06V9.25h-2.72c.04.78 0 11.25 0 11.25h2.72v-6.28c0-.34.02-.67.13-.91.28-.67.92-1.36 2-1.36 1.4 0 1.97 1.03 1.97 2.54v6.01H20.5v-6.43Z" />
    </SocialSvg>
  );
}
