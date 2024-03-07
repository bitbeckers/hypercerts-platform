import { useSearchParams } from "@remix-run/react";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { DynamicCategoryIcon } from "~/components/ui/dynamic-category-icon";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import type { Report } from "~/types";
import ReportsFilters from "./reports-filters";

interface ReportsHeaderProps {
	reports: Report[];
	amounts: number[];
}

const sortingOptions = [
	"$ to $$$ needed",
	"$$$ to $ needed",
	"Newest to oldest",
	"Oldest to newest",
];

const ReportsHeader: React.FC<ReportsHeaderProps> = ({ reports, amounts }) => {
	const uniqueCategories = useMemo(() => {
		return reports
			.map((report: Report, index: number) => report.category)
			.filter(
				(value: string, index: number, self: string[]) =>
					self.indexOf(value) === index,
			);
	}, [reports]);

	const uniqueMediaOutlets = useMemo(() => {
		return reports
			.map((report: Report, index: number) => report.contributors[0])
			.filter(
				(value: string, index: number, self: string[]) =>
					self.indexOf(value) === index,
			);
	}, [reports]);

	// updated to return a type Option[] of {label: state, value: state} objects
	// needed to pass into MultipleSelector component for State filter
	const uniqueStates = useMemo(() => {
		return reports
			.map((report: Report, index: number) => ({
				label: report.state,
				value: report.state,
			}))
			.filter(
				(
					value: { label: string; value: string },
					index: number,
					self: { label: string; value: string }[],
				) => self.findIndex((t) => t.label === value.label) === index,
			);
	}, [reports]);

	const [searchParams, setSearchParams] = useSearchParams();
	const [searchBarInput, setsearchBarInput] = useState("");
	const [categorySelected, setCategorySelected] = useState<string>();
	const [dynamicKeyForInput, setDynamicKeyForInput] = useState(0);

	const toggleCategorySelection = (category: string) => {
		searchParams.delete("category");
		if (category === categorySelected) {
			setCategorySelected("");
		} else {
			setCategorySelected(category);
			searchParams.append("category", category);
		}
		setSearchParams(searchParams, {
			preventScrollReset: true,
		});
	};

	return (
		<article className="w-full max-w-screen-xl">
			<h2 className="text-3xl md:text-4xl font-semibold pb-1 pt-6 md:pt-10">
				Reports
			</h2>
			<p className="text-sm">Find and fund reports that resonate with you.</p>
			<div className="flex flex-col xl:flex-row xl:justify-between gap-3 w-full py-4">
				<div className="flex gap-2">
					{uniqueCategories.map((category: string) => (
						<Badge
							key={category}
							className={`border-vd-blue-500 rounded-full flex flex-auto flex-col md:flex-row items-center gap-1 px-3 py-2 cursor-pointer ${
								categorySelected === category
									? "bg-vd-blue-900 text-vd-beige-100 hover:bg-vd-blue-700"
									: ""
							}`}
							onClick={() => toggleCategorySelection(category)}
						>
							<DynamicCategoryIcon category={category} />
							<p className="text-xs">{category}</p>
						</Badge>
					))}
				</div>

				<div className="flex flex-1 max-w-[500px] gap-2">
					<Input
						className="pr-[65px] rounded-r-3xl h-10 border-vd-blue-500 bg-vd-beige-100 py-2 text-sm font-medium placeholder:text-vd-blue-500/60 ring-offset-white focus-visible:ring-offset-2 focus-visible:ring-vd-blue-400 focus-visible:ring-2"
						key={dynamicKeyForInput}
						type="search"
						placeholder="Search in title, summary"
						onChange={(e) => {
							setsearchBarInput(e.target.value);
						}}
					/>
					<Button
						className="ml-[-65px]"
						onClick={() => {
							if (searchParams.has("search-input")) {
								searchParams.delete("search-input");
							}
							searchParams.append("search-input", searchBarInput);
							setSearchParams(searchParams, {
								preventScrollReset: true,
							});
						}}
					>
						<Search />
					</Button>
				</div>
				<div className="flex gap-2">
					<div>
						<ReportsFilters
							outlets={uniqueMediaOutlets}
							states={uniqueStates}
							amounts={amounts}
						/>
					</div>
					<Select
						key={dynamicKeyForInput}
						name="sort"
						onValueChange={(value) => {
							if (searchParams.has("sort")) {
								searchParams.delete("sort");
							}
							searchParams.append("sort", value);
							setSearchParams(searchParams, {
								preventScrollReset: true,
							});
						}}
					>
						<SelectTrigger className="max-w-[300px] min-w-[170px]">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							{sortingOptions.map((option: string) => (
								<SelectItem key={option} value={option}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						className="text-xs"
						variant={"outline"}
						onClick={() => {
							setCategorySelected("");
							setDynamicKeyForInput(Math.ceil(Math.random() * 10));
							setSearchParams("", {
								preventScrollReset: true,
							});
						}}
					>
						Reset
					</Button>
				</div>
			</div>
		</article>
	);
};

export default ReportsHeader;
