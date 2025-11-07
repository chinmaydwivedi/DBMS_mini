import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const footerSections = [
  {
    title: "About",
    links: ["About Us", "Careers", "Press", "Investor Relations", "Corporate Information"],
  },
  {
    title: "Help",
    links: ["Customer Support", "Shipping & Delivery", "Returns & Refunds", "FAQs", "Track Order"],
  },
  {
    title: "Policy",
    links: ["Privacy Policy", "Terms of Use", "Security", "Sitemap", "EPR Compliance"],
  },
  {
    title: "Social",
    links: ["Facebook", "Twitter", "Instagram", "Youtube", "LinkedIn"],
  },
];

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4 text-primary">
              ShopKart
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              India's largest online marketplace for all your shopping needs.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-primary transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-primary transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Email Support</p>
                <p className="text-sm text-gray-400">support@shopkart.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">24/7 Helpline</p>
                <p className="text-sm text-gray-400">1800-123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Head Office</p>
                <p className="text-sm text-gray-400">Bangalore, Karnataka, India</p>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400">
            <p>&copy; 2025 ShopKart. All rights reserved. Built with ❤️ in India</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

