'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Course } from '@/types/curriculum';

interface CoursePricingFormProps {
	courseData: Course;
	setCourseData: React.Dispatch<React.SetStateAction<Course | null>>;
}

export function CoursePricingForm({
	courseData,
	setCourseData,
}: CoursePricingFormProps) {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="price">Price ($)</Label>
				<Input
					id="price"
					placeholder="49.99"
					value={courseData.price}
					onChange={(e) =>
						setCourseData({ ...courseData, price: e.target.value })
					}
				/>
				<p className="text-muted-foreground text-xs">
					Set to 0 for a free course
				</p>
			</div>

			<div className="space-y-2">
				<Label htmlFor="pricingModel">Pricing Model</Label>
				<Select
					value={courseData.pricingModel}
					onValueChange={(value) =>
						setCourseData({
							...courseData,
							pricingModel: value as 'one-time' | 'subscription',
						})
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select pricing model" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="one-time">One-time Purchase</SelectItem>
						<SelectItem value="subscription">Subscription</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
