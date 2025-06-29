import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, FileText, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InstructorTaxInfoPage() {
	const [loading, setLoading] = useState(false);

	const handleSaveChanges = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			toast.success('Tax information saved successfully');
		}, 1000);
	};

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="mb-6 flex items-center gap-2">
				<Button variant="ghost" size="sm" asChild>
					<Link to="/dashboard/instructor/earnings/settings">
						<ArrowLeft className="mr-1 h-4 w-4" />
						Back to Earnings Settings
					</Link>
				</Button>
			</div>

			<div>
				<h1 className="text-3xl font-bold tracking-tight">Tax Information</h1>
				<p className="text-muted-foreground">
					Manage your tax details for accurate reporting and compliance
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Tax Form Information</CardTitle>
					<CardDescription>
						Complete your tax information for proper reporting
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
						<div className="flex items-start gap-3">
							<Info className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
							<div>
								<h4 className="font-medium text-blue-800 dark:text-blue-300">
									Important Tax Information
								</h4>
								<p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
									As an instructor earning income through our platform, you are
									required to provide accurate tax information. For U.S.
									citizens or residents, we'll need your W-9 information. For
									non-U.S. persons, we'll need W-8BEN information.
								</p>
							</div>
						</div>
					</div>

					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="tax-country">Country of Tax Residence</Label>
							<Select defaultValue="us">
								<SelectTrigger id="tax-country">
									<SelectValue placeholder="Select country" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="us">United States</SelectItem>
									<SelectItem value="ca">Canada</SelectItem>
									<SelectItem value="uk">United Kingdom</SelectItem>
									<SelectItem value="au">Australia</SelectItem>
									<SelectItem value="other">Other</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="tax-id-type">Tax ID Type</Label>
							<Select defaultValue="ssn">
								<SelectTrigger id="tax-id-type">
									<SelectValue placeholder="Select tax ID type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ssn">
										Social Security Number (SSN)
									</SelectItem>
									<SelectItem value="ein">
										Employer Identification Number (EIN)
									</SelectItem>
									<SelectItem value="itin">
										Individual Taxpayer Identification Number (ITIN)
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="tax-id">Tax ID Number</Label>
							<Input
								id="tax-id"
								placeholder="Enter tax ID number"
								type="password"
							/>
							<p className="text-muted-foreground text-xs">
								Your tax ID is encrypted and securely stored
							</p>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="legal-name">
								Legal Name (as shown on tax return)
							</Label>
							<Input id="legal-name" placeholder="Enter legal name" />
						</div>

						<div className="grid gap-2">
							<Label htmlFor="business-type">Business Type</Label>
							<Select defaultValue="individual">
								<SelectTrigger id="business-type">
									<SelectValue placeholder="Select business type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="individual">
										Individual/Sole Proprietor
									</SelectItem>
									<SelectItem value="llc">LLC</SelectItem>
									<SelectItem value="corporation">Corporation</SelectItem>
									<SelectItem value="partnership">Partnership</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<Separator />

					<div className="space-y-4">
						<h3 className="text-lg font-medium">Address Information</h3>

						<div className="grid gap-2">
							<Label htmlFor="address-line1">Address Line 1</Label>
							<Input id="address-line1" placeholder="Enter street address" />
						</div>

						<div className="grid gap-2">
							<Label htmlFor="address-line2">Address Line 2 (Optional)</Label>
							<Input
								id="address-line2"
								placeholder="Apartment, suite, unit, etc."
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="city">City</Label>
								<Input id="city" placeholder="Enter city" />
							</div>

							<div className="grid gap-2">
								<Label htmlFor="state">State/Province</Label>
								<Input id="state" placeholder="Enter state/province" />
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="postal-code">Postal/ZIP Code</Label>
								<Input id="postal-code" placeholder="Enter postal/ZIP code" />
							</div>

							<div className="grid gap-2">
								<Label htmlFor="country">Country</Label>
								<Select defaultValue="us">
									<SelectTrigger id="country">
										<SelectValue placeholder="Select country" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="us">United States</SelectItem>
										<SelectItem value="ca">Canada</SelectItem>
										<SelectItem value="uk">United Kingdom</SelectItem>
										<SelectItem value="au">Australia</SelectItem>
										<SelectItem value="other">Other</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					<div className="flex items-center space-x-2 pt-2">
						<Switch id="tax-certification" />
						<Label htmlFor="tax-certification" className="text-sm">
							Under penalties of perjury, I certify that the information
							provided is true, correct, and complete.
						</Label>
					</div>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button variant="outline" asChild>
						<Link to="/dashboard/instructor/earnings/settings">Cancel</Link>
					</Button>
					<Button onClick={handleSaveChanges} disabled={loading}>
						{loading ? 'Saving...' : 'Save Tax Information'}
					</Button>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Tax Documents</CardTitle>
					<CardDescription>
						Access and download your tax documents
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center justify-between rounded-lg border p-4">
							<div className="flex items-center gap-3">
								<div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
									<FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
								</div>
								<div>
									<p className="font-medium">1099-NEC (2023)</p>
									<p className="text-muted-foreground text-sm">
										Issued on January 31, 2024
									</p>
								</div>
							</div>
							<Button variant="outline" size="sm">
								Download PDF
							</Button>
						</div>

						<div className="flex items-center justify-between rounded-lg border p-4">
							<div className="flex items-center gap-3">
								<div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
									<FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
								</div>
								<div>
									<p className="font-medium">1099-NEC (2022)</p>
									<p className="text-muted-foreground text-sm">
										Issued on January 31, 2023
									</p>
								</div>
							</div>
							<Button variant="outline" size="sm">
								Download PDF
							</Button>
						</div>

						<div className="flex items-center justify-between rounded-lg border p-4">
							<div className="flex items-center gap-3">
								<div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
									<FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
								</div>
								<div>
									<p className="font-medium">W-9 Form</p>
									<p className="text-muted-foreground text-sm">
										Submitted on March 15, 2022
									</p>
								</div>
							</div>
							<Button variant="outline" size="sm">
								View Form
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Tax FAQ</CardTitle>
					<CardDescription>
						Frequently asked questions about taxes for instructors
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<h4 className="font-medium">
								When will I receive my tax documents?
							</h4>
							<p className="text-muted-foreground mt-1 text-sm">
								Tax documents for the previous year (such as Form 1099-NEC for
								US instructors) will be available by January 31st of the
								following year.
							</p>
						</div>

						<div>
							<h4 className="font-medium">What tax form will I receive?</h4>
							<p className="text-muted-foreground mt-1 text-sm">
								US instructors who earn $600 or more in a calendar year will
								receive a Form 1099-NEC. Non-US instructors may receive
								different forms based on their country's tax treaties with the
								US.
							</p>
						</div>

						<div>
							<h4 className="font-medium">
								How is my income reported to tax authorities?
							</h4>
							<p className="text-muted-foreground mt-1 text-sm">
								We report your earnings to the appropriate tax authorities based
								on the information you provide. For US instructors, this is
								typically reported to the IRS.
							</p>
						</div>

						<div>
							<h4 className="font-medium">
								Do I need to pay self-employment tax?
							</h4>
							<p className="text-muted-foreground mt-1 text-sm">
								In many countries, including the US, income earned as an
								instructor may be considered self-employment income and subject
								to self-employment taxes. We recommend consulting with a tax
								professional for guidance specific to your situation.
							</p>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Button variant="outline" asChild className="w-full">
						<Link to="/help/instructor-tax-guide">View Complete Tax Guide</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
