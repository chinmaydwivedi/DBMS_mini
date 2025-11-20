import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Plus, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { supportAPI } from "@/lib/api";
import { toast } from "sonner";

const Support = () => {
  const userId = 1;
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Order',
    subject: '',
    description: '',
    priority: 'Medium',
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await supportAPI.getByUserId(userId);
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await supportAPI.create({
        user_id: userId,
        ...formData,
      });
      toast.success("Support ticket created successfully");
      setShowForm(false);
      setFormData({
        category: 'Order',
        subject: '',
        description: '',
        priority: 'Medium',
      });
      fetchTickets();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create ticket");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Resolved': 
      case 'Closed': 
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'InProgress': 
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'Open': 
      default: 
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': 
      case 'Closed': 
        return 'bg-green-100 text-green-800';
      case 'InProgress': 
        return 'bg-blue-100 text-blue-800';
      case 'Open': 
      default: 
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading support tickets...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Support Tickets</h1>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-5 h-5 mr-2" />
            New Ticket
          </Button>
        </div>

        {/* Create Ticket Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Create Support Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="Order">Order Issue</option>
                    <option value="Product">Product Issue</option>
                    <option value="Payment">Payment Issue</option>
                    <option value="Delivery">Delivery Issue</option>
                    <option value="Return">Return/Refund</option>
                    <option value="Account">Account Issue</option>
                    <option value="Technical">Technical Issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <Input
                  placeholder="Brief description of your issue"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[120px]"
                  placeholder="Provide detailed information about your issue..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-4">
                <Button type="submit">Submit Ticket</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Tickets List */}
        {tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No support tickets yet</h3>
            <p className="text-gray-600 mb-6">
              Create a ticket if you need help with anything
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Create Ticket
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.ticket_id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{ticket.subject}</h3>
                      <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority} Priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Ticket #{ticket.ticket_number} • {ticket.category}
                    </p>
                    <p className="text-sm text-gray-700">
                      Created {new Date(ticket.created_at).toLocaleDateString()} at{' '}
                      {new Date(ticket.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(ticket.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>

                {ticket.updated_at !== ticket.created_at && (
                  <p className="text-sm text-gray-600 mb-2">
                    Last updated {new Date(ticket.updated_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Support;

