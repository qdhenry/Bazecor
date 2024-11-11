// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2024  Dygmalab, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from "react";
import { cn } from "@Renderer/utils";

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
	selected?: boolean;
	disabled?: boolean;
	variant?: "default" | "outline";
	size?: "default" | "sm" | "lg";
}

export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
	(
		{
			className,
			selected,
			disabled,
			variant = "default",
			size = "default",
			children,
			...props
		},
		ref,
	) => {
		return (
			<div
				ref={ref}
				className={cn(
					"inline-flex items-center rounded-md transition-colors",
					"hover:bg-gray-100 dark:hover:bg-gray-700",
					"cursor-pointer select-none",
					{
						"bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100":
							variant === "default",
						"border border-gray-200 dark:border-gray-700":
							variant === "outline",
						"bg-gray-100 dark:bg-gray-700": selected,
						"opacity-50 cursor-not-allowed": disabled,
						"px-3 py-1.5 text-sm": size === "default",
						"px-2 py-1 text-xs": size === "sm",
						"px-4 py-2 text-base": size === "lg",
					},
					className,
				)}
				{...props}
			>
				{children}
			</div>
		);
	},
);

Chip.displayName = "Chip";
