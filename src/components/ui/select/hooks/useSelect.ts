import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import {
  SELECT_MENU_GAP,
  SELECT_MENU_MAX_HEIGHT,
  SELECT_TYPEAHEAD_TIMEOUT,
  SELECT_VIEWPORT_MARGIN,
} from '../const/selectConfig';
import { nextEnabledOption, optionText } from '../lib/selectOptions';
import type { SelectProps } from '../types/selectTypes';

export function useSelect({ value, options, onValueChange, disabled }: SelectProps) {
  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const search = useRef({ text: '', at: 0 });
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const selectedIndex = options.findIndex((option) => String(option.value) === String(value));
  const active = activeIndex >= 0 && activeIndex < options.length ? activeIndex : selectedIndex;

  function openMenu(direction: 1 | -1 = 1) {
    if (disabled || !options.some((option) => !option.disabled)) return;
    setActiveIndex(
      selectedIndex >= 0 && !options[selectedIndex].disabled
        ? selectedIndex
        : nextEnabledOption(options, direction === 1 ? -1 : 0, direction),
    );
    search.current = { text: '', at: 0 };
    setOpen(true);
  }

  function choose(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    onValueChange(String(option.value));
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      return;
    }
    if (event.key === 'Tab') {
      setOpen(false);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      if (!open) openMenu(direction);
      else setActiveIndex(nextEnabledOption(options, active, direction));
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      if (!open) openMenu();
      setActiveIndex(
        nextEnabledOption(options, event.key === 'Home' ? -1 : 0, event.key === 'Home' ? 1 : -1),
      );
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      if (
        event.key === ' ' &&
        search.current.text &&
        Date.now() - search.current.at < SELECT_TYPEAHEAD_TIMEOUT
      ) {
        // A space may belong to a student's name during typeahead.
      } else {
        event.preventDefault();
        if (open) choose(active);
        else openMenu();
        return;
      }
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
      event.preventDefault();
      const now = Date.now();
      const text =
        (now - search.current.at < SELECT_TYPEAHEAD_TIMEOUT ? search.current.text : '') +
        event.key.toLocaleLowerCase();
      search.current = { text, at: now };
      if (!open) openMenu();
      // Repeated letters cycle through names starting with that letter.
      const query = [...text].every((letter) => letter === text[0]) ? text[0] : text;
      for (let step = 1; step <= options.length; step++) {
        const index = (Math.max(active, -1) + step) % options.length;
        if (
          !options[index].disabled &&
          optionText(options[index].label).toLocaleLowerCase().startsWith(query)
        ) {
          setActiveIndex(index);
          break;
        }
      }
      search.current = { text, at: now };
    }
  }

  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    const trigger = triggerRef.current;
    if (!menu || !trigger) return;

    // Popover gives our styled list its own top layer, including inside a modal dialog.
    menu.showPopover();
    function position() {
      if (!menu || !trigger) return;
      const rect = trigger.getBoundingClientRect();
      const below = window.innerHeight - rect.bottom - SELECT_MENU_GAP - SELECT_VIEWPORT_MARGIN;
      const above = rect.top - SELECT_MENU_GAP - SELECT_VIEWPORT_MARGIN;
      menu.style.width =
        Math.min(rect.width, window.innerWidth - SELECT_VIEWPORT_MARGIN * 2) + 'px';
      const desired = Math.min(SELECT_MENU_MAX_HEIGHT, menu.scrollHeight);
      const upwards = below < desired && above > below;
      const available = Math.max(0, upwards ? above : below);
      menu.style.maxHeight = Math.min(SELECT_MENU_MAX_HEIGHT, available) + 'px';
      menu.style.left =
        Math.max(
          SELECT_VIEWPORT_MARGIN,
          Math.min(rect.left, window.innerWidth - menu.offsetWidth - SELECT_VIEWPORT_MARGIN),
        ) + 'px';
      menu.style.top =
        (upwards
          ? Math.max(SELECT_VIEWPORT_MARGIN, rect.top - SELECT_MENU_GAP - menu.offsetHeight)
          : rect.bottom + SELECT_MENU_GAP) + 'px';
    }
    position();
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !trigger.contains(event.target) &&
        !menu.contains(event.target)
      )
        setOpen(false);
    };
    const onScroll = (event: Event) => {
      if (event.target instanceof Node && menu.contains(event.target)) return;
      position();
    };
    document.addEventListener('pointerdown', outside);
    window.addEventListener('resize', position);
    document.addEventListener('scroll', onScroll, true);
    const observer = new ResizeObserver(position);
    observer.observe(trigger);
    return () => {
      document.removeEventListener('pointerdown', outside);
      window.removeEventListener('resize', position);
      document.removeEventListener('scroll', onScroll, true);
      observer.disconnect();
      if (menu.isConnected && menu.matches(':popover-open')) menu.hidePopover();
    };
  }, [open, options.length]);

  useEffect(() => {
    if (!open || active < 0) return;
    const menu = menuRef.current;
    const option = menu?.querySelector<HTMLElement>(`[data-option-index="${active}"]`);
    if (!menu || !option) return;
    if (option.offsetTop < menu.scrollTop) menu.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > menu.scrollTop + menu.clientHeight)
      menu.scrollTop = option.offsetTop + option.offsetHeight - menu.clientHeight;
  }, [open, active]);

  return {
    listId,
    triggerRef,
    menuRef,
    open,
    active,
    selectedIndex,
    setActiveIndex,
    openMenu,
    choose,
    onKeyDown,
    close: () => setOpen(false),
  };
}
