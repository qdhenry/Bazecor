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

import React, { useState } from "react";
import { i18n } from "@Renderer/i18n";

import NameModal from "@Renderer/components/molecules/CustomModal/ModalName";
import { Chip } from "@Renderer/components/atoms/Chip";
import {
	IconDelete,
	IconPen,
	IconClone,
	IconAddNew,
} from "@Renderer/components/atoms/icons";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@Renderer/components/atoms/Tooltip";
import { Button } from "@Renderer/components/atoms/Button";

interface ItemList {
	id: number;
	name: string;
}

const SuperkeysSelector: React.FC<any> = ({
	onSelect,
	itemList,
	selectedItem,
	deleteItem,
	addItem,
	updateItem,
	cloneItem,
	subtitle,
}) => {
	const [show, setShow] = useState(false);
	const toggleShow = () => setShow(!show);
	const [showAdd, setShowAdd] = useState(false);
	const toggleShowAdd = () => setShowAdd(!showAdd);

	const handleSave = (data: string) => {
		toggleShow();
		updateItem(data);
	};

	const handleAdd = (data: string) => {
		toggleShowAdd();
		addItem(data);
	};

	return (
		<div className="flex flex-col w-full gap-2">
			<div className="flex items-center justify-between w-full">
				<span className="text-sm font-medium text-gray-500 dark:text-gray-200">
					{subtitle}
				</span>
				<TooltipProvider delayDuration={50}>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="secondary" size="icon" onClick={toggleShowAdd}>
								<IconAddNew />
							</Button>
						</TooltipTrigger>
						<TooltipContent className="max-w-xs" side="bottom" size="sm">
							{i18n.general.new} superkey
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<div className="flex flex-wrap gap-2 min-h-[40px] p-2 w-full bg-gray-50 dark:bg-gray-800 rounded-md">
				{itemList.map((item: ItemList, i: number) => (
					<Chip
						key={`item-macro-id-${item.id}`}
						selected={selectedItem === i}
						onClick={() => onSelect(i)}
						className="group"
					>
						<span className="mr-2 text-xs text-gray-500">#{i + 1}</span>
						<span>{item.name === "" ? i18n.general.noname : item.name}</span>

						{selectedItem === i && (
							<div className="flex items-center gap-1 ml-2">
								<TooltipProvider delayDuration={50}>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="ghost"
												size="xs"
												onClick={(e) => {
													e.stopPropagation();
													toggleShow();
												}}
											>
												<IconPen className="w-3 h-3" />
											</Button>
										</TooltipTrigger>
										<TooltipContent side="bottom" size="sm">
											{i18n.app.menu.changeName}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>

								<TooltipProvider delayDuration={50}>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="ghost"
												size="xs"
												onClick={(e) => {
													e.stopPropagation();
													cloneItem();
												}}
											>
												<IconClone className="w-3 h-3" />
											</Button>
										</TooltipTrigger>
										<TooltipContent side="bottom" size="sm">
											{i18n.general.clone}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>

								<TooltipProvider delayDuration={50}>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="ghost"
												size="xs"
												onClick={(e) => {
													e.stopPropagation();
													deleteItem();
												}}
											>
												<IconDelete className="w-3 h-3" />
											</Button>
										</TooltipTrigger>
										<TooltipContent side="bottom" size="sm">
											{i18n.general.delete}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						)}
					</Chip>
				))}
			</div>

			{itemList === undefined ||
			itemList.length === 0 ||
			itemList.length <= selectedItem ? (
				""
			) : (
				<NameModal
					show={show}
					name={itemList[selectedItem]?.name}
					toggleShow={toggleShow}
					handleSave={handleSave}
					modalTitle={i18n.editor.superkeys.createModal.createNew}
					labelInput={i18n.editor.superkeys.createModal.inputLabel}
				/>
			)}
			<NameModal
				show={showAdd}
				name=""
				toggleShow={toggleShowAdd}
				handleSave={handleAdd}
				modalTitle={i18n.editor.superkeys.createModal.createNew}
				labelInput={i18n.editor.superkeys.createModal.inputLabel}
			/>
		</div>
	);
};

export default SuperkeysSelector;
