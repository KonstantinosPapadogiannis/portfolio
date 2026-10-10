"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import type { NavItem } from "@/config/navigation";
import { NavLink } from "@/components/nav-link";
import { Container } from "@/components/ui/container";
import { IconButton } from "@/components/ui/icon-button";
import { CloseIcon, MenuIcon } from "@/components/icons";

type MobileNavProps = {
  items: readonly (NavItem & { label: string })[];
  navLabel: string;
  menuLabel: string;
};

export function MobileNav({ items, navLabel, menuLabel }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function closeOnLinkClick(event: MouseEvent<HTMLElement>) {
    if ((event.target as Element).closest("a")) setOpen(false);
  }

  return (
    <>
      <IconButton
        ref={buttonRef}
        aria-label={menuLabel}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="lg:hidden"
      >
        {open ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
      </IconButton>

      <nav
        id={panelId}
        aria-label={navLabel}
        hidden={!open}
        onClick={closeOnLinkClick}
        className="absolute inset-x-0 top-full z-40 border-b border-border bg-background lg:hidden"
      >
        <Container as="ul" className="py-2">
          {items.map((item) => (
            <li
              key={item.key}
              className="border-b border-border last:border-b-0"
            >
              <NavLink
                item={item}
                className="flex h-12 items-center text-[17px] text-ink transition-colors duration-150 hover:text-steel"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </Container>
      </nav>
    </>
  );
}
