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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
	ArrowLeft,
	Check,
	CreditCard,
	HelpCircle,
	Info,
	Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InstructorEarningsSettingsPage() {
	const [activeTab, setActiveTab] = useState('payment-methods');
	const [loading, setLoading] = useState(false);

	const handleSaveChanges = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			toast.success('Settings saved successfully');
		}, 1000);
	};

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="mb-6 flex items-center gap-2">
				<Button variant="ghost" size="sm" asChild>
					<Link to="/dashboard/instructor/earnings">
						<ArrowLeft className="mr-1 h-4 w-4" />
						Back to Earnings
					</Link>
				</Button>
			</div>

			<div>
				<h1 className="text-3xl font-bold tracking-tight">Earnings Settings</h1>
				<p className="text-muted-foreground">
					Manage your payment methods, payout preferences, and tax information
				</p>
			</div>

			<Tabs
				defaultValue="payment-methods"
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-4"
			>
				<TabsList>
					<TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
					<TabsTrigger value="payout-preferences">
						Payout Preferences
					</TabsTrigger>
					<TabsTrigger value="tax-information">Tax Information</TabsTrigger>
				</TabsList>

				<TabsContent value="payment-methods" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Payment Methods</CardTitle>
							<CardDescription>Manage your payout methods</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="rounded-lg border p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
											<CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
										</div>
										<div>
											<p className="font-medium">Bank of America</p>
											<p className="text-muted-foreground text-sm">****6789</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-300">
											<Check className="h-3 w-3" /> Default
										</div>
										<Button variant="outline" size="sm">
											Edit
										</Button>
									</div>
								</div>
							</div>

							<div className="rounded-lg border p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
											<CreditCard className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
										</div>
										<div>
											<p className="font-medium">PayPal</p>
											<p className="text-muted-foreground text-sm">
												instructor@example.com
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Button variant="outline" size="sm">
											Edit
										</Button>
										<Button variant="ghost" size="sm">
											Set as Default
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="text-destructive"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</div>

							<Button className="w-full">Add Payment Method</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Add New Payment Method</CardTitle>
							<CardDescription>
								Select a payment method type to add
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Tabs defaultValue="bank">
								<TabsList className="grid w-full grid-cols-2">
									<TabsTrigger value="bank">Bank Account</TabsTrigger>
									<TabsTrigger value="paypal">PayPal</TabsTrigger>
								</TabsList>
								<TabsContent value="bank" className="space-y-4 pt-4">
									<div className="grid gap-2">
										<Label htmlFor="bank-name">Bank Name</Label>
										<Input id="bank-name" placeholder="Enter bank name" />
									</div>
									<div className="grid gap-2">
										<Label htmlFor="account-name">Account Holder Name</Label>
										<Input
											id="account-name"
											placeholder="Enter account holder name"
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="account-number">Account Number</Label>
										<Input
											id="account-number"
											placeholder="Enter account number"
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="routing-number">Routing Number</Label>
										<Input
											id="routing-number"
											placeholder="Enter routing number"
										/>
									</div>
									<div className="flex items-center space-x-2 pt-2">
										<Switch id="set-default-bank" />
										<Label htmlFor="set-default-bank">
											Set as default payment method
										</Label>
									</div>
								</TabsContent>
								<TabsContent value="paypal" className="space-y-4 pt-4">
									<div className="grid gap-2">
										<Label htmlFor="paypal-email">PayPal Email</Label>
										<Input
											id="paypal-email"
											type="email"
											placeholder="Enter PayPal email"
										/>
									</div>
									<div className="flex items-center space-x-2 pt-2">
										<Switch id="set-default-paypal" />
										<Label htmlFor="set-default-paypal">
											Set as default payment method
										</Label>
									</div>
								</TabsContent>
							</Tabs>
						</CardContent>
						<CardFooter className="flex justify-between">
							<Button variant="outline">Cancel</Button>
							<Button>Add Payment Method</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				<TabsContent value="payout-preferences" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Payout Preferences</CardTitle>
							<CardDescription>
								Configure how and when you receive your earnings
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4">
								<div className="grid gap-2">
									<Label htmlFor="payout-threshold">Payout Threshold</Label>
									<Select defaultValue="100">
										<SelectTrigger id="payout-threshold">
											<SelectValue placeholder="Select threshold" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="50">$50.00</SelectItem>
											<SelectItem value="100">$100.00</SelectItem>
											<SelectItem value="250">$250.00</SelectItem>
											<SelectItem value="500">$500.00</SelectItem>
											<SelectItem value="1000">$1,000.00</SelectItem>
										</SelectContent>
									</Select>
									<p className="text-muted-foreground text-xs">
										Minimum amount required before automatic payout is processed
									</p>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="payout-frequency">Payout Frequency</Label>
									<Select defaultValue="monthly">
										<SelectTrigger id="payout-frequency">
											<SelectValue placeholder="Select frequency" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="weekly">Weekly</SelectItem>
											<SelectItem value="biweekly">Bi-weekly</SelectItem>
											<SelectItem value="monthly">Monthly</SelectItem>
										</SelectContent>
									</Select>
									<p className="text-muted-foreground text-xs">
										How often you want to receive your payouts
									</p>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="payout-day">Payout Day</Label>
									<Select defaultValue="15">
										<SelectTrigger id="payout-day">
											<SelectValue placeholder="Select day" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="1">1st of month</SelectItem>
											<SelectItem value="15">15th of month</SelectItem>
											<SelectItem value="last">Last day of month</SelectItem>
										</SelectContent>
									</Select>
									<p className="text-muted-foreground text-xs">
										Day of the month when payouts are processed
									</p>
								</div>
							</div>

							<Separator />

							<div className="space-y-4">
								<h3 className="text-lg font-medium">Notifications</h3>

								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="notify-payout">Payout Notifications</Label>
										<p className="text-muted-foreground text-sm">
											Receive email notifications when payouts are processed
										</p>
									</div>
									<Switch id="notify-payout" defaultChecked />
								</div>

								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="notify-earnings">Earnings Reports</Label>
										<p className="text-muted-foreground text-sm">
											Receive monthly earnings reports via email
										</p>
									</div>
									<Switch id="notify-earnings" defaultChecked />
								</div>

								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="notify-threshold">Threshold Alerts</Label>
										<p className="text-muted-foreground text-sm">
											Get notified when your earnings reach the payout threshold
										</p>
									</div>
									<Switch id="notify-threshold" defaultChecked />
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button onClick={handleSaveChanges} disabled={loading}>
								{loading ? 'Saving...' : 'Save Changes'}
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				<TabsContent value="tax-information" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Tax Information</CardTitle>
							<CardDescription>
								Manage your tax details for accurate reporting
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
								<div className="flex items-start gap-3">
									<Info className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
									<div>
										<h4 className="font-medium text-blue-800 dark:text-blue-300">
											Tax Information Required
										</h4>
										<p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
											Complete your tax information to ensure proper tax
											reporting and avoid withholding issues. This information
											is required by law for all instructors earning revenue.
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
									<Input
										id="address-line1"
										placeholder="Enter street address"
									/>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="address-line2">
										Address Line 2 (Optional)
									</Label>
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
										<Input
											id="postal-code"
											placeholder="Enter postal/ZIP code"
										/>
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
									I certify that the information provided is true and correct to
									the best of my knowledge
								</Label>
							</div>
						</CardContent>
						<CardFooter className="flex justify-between">
							<Button variant="outline">Cancel</Button>
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
							<div className="rounded-md border">
								<div className="p-4 text-center">
									<HelpCircle className="text-muted-foreground/50 mx-auto h-12 w-12" />
									<h3 className="mt-4 text-lg font-medium">
										No tax documents available yet
									</h3>
									<p className="text-muted-foreground mt-2 text-sm">
										Tax documents for the current year will be available by
										January 31st of next year.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
