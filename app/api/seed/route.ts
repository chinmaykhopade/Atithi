import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Hotel from "@/models/Hotel";
import Room from "@/models/Room";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Hotel.deleteMany({});
    await Room.deleteMany({});

    // Create users
    const adminPass = await hashPassword("admin123");
    const ownerPass = await hashPassword("owner123");
    const customerPass = await hashPassword("customer123");

    const admin = await User.create({
      name: "Admin Sharma",
      email: "admin@smarthotel.in",
      password: adminPass,
      role: "admin",
      phone: "+91 9876543210",
    });

    const owner1 = await User.create({
      name: "Rajesh Patel",
      email: "rajesh@smarthotel.in",
      password: ownerPass,
      role: "owner",
      phone: "+91 9876543211",
    });

    const owner2 = await User.create({
      name: "Priya Nair",
      email: "priya@smarthotel.in",
      password: ownerPass,
      role: "owner",
      phone: "+91 9876543212",
    });

    const customer = await User.create({
      name: "Amit Kumar",
      email: "amit@gmail.com",
      password: customerPass,
      role: "customer",
      phone: "+91 9876543213",
    });

    // Create hotels
    const hotels = await Hotel.insertMany([
      {
        ownerId: owner1._id,
        name: "Taj Palace Heritage",
        description: "Experience the grandeur of royal Rajasthan at our heritage palace hotel. With intricately carved sandstone facades, sprawling courtyards, and a rooftop restaurant overlooking the Aravalli hills, every moment here is steeped in regal elegance.",
        city: "Jaipur",
        state: "Rajasthan",
        address: "Amer Road, Near Jal Mahal, Jaipur 302002",
        pricePerNight: 8500,
        amenities: ["WiFi", "AC", "Pool", "Spa", "Restaurant", "Heritage Walk", "Parking"],
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
        ],
        rating: 4.7,
        totalReviews: 234,
        isApproved: true,
      },
      {
        ownerId: owner1._id,
        name: "Mumbai Sea View Grand",
        description: "A modern luxury hotel facing the Arabian Sea along Marine Drive. Floor-to-ceiling windows offer breathtaking sunsets, while our world-class dining and rooftop infinity pool redefine Mumbai hospitality.",
        city: "Mumbai",
        state: "Maharashtra",
        address: "Marine Drive, Churchgate, Mumbai 400020",
        pricePerNight: 12000,
        amenities: ["WiFi", "AC", "Pool", "Gym", "Restaurant", "Bar", "Room Service", "Laundry"],
        images: [
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        ],
        rating: 4.5,
        totalReviews: 189,
        isApproved: true,
      },
      {
        ownerId: owner2._id,
        name: "Kerala Backwater Resort",
        description: "Nestled among the serene backwaters of Alleppey, our eco-luxury resort offers traditional Kerala architecture blended with modern comforts. Wake up to birdsong, enjoy Ayurvedic spa treatments, and cruise the backwaters on our private houseboat.",
        city: "Kerala",
        state: "Kerala",
        address: "Alleppey Backwaters, Alappuzha, Kerala 688001",
        pricePerNight: 6500,
        amenities: ["WiFi", "AC", "Ayurvedic Spa", "Restaurant", "Yoga Center", "Pool"],
        images: [
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
        ],
        rating: 4.8,
        totalReviews: 312,
        isApproved: true,
      },
      {
        ownerId: owner2._id,
        name: "Goa Beach Paradise",
        description: "A vibrant beachside resort in South Goa where Portuguese heritage meets tropical charm. Steps from pristine Palolem beach, our resort features open-air dining, live music evenings, and luxurious cottages surrounded by palm groves.",
        city: "Goa",
        state: "Goa",
        address: "Palolem Beach, Canacona, Goa 403702",
        pricePerNight: 5500,
        amenities: ["WiFi", "AC", "Pool", "Bar", "Restaurant", "Pet Friendly", "Parking"],
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        ],
        rating: 4.3,
        totalReviews: 156,
        isApproved: true,
      },
      {
        ownerId: owner1._id,
        name: "Delhi Imperial Suites",
        description: "Located in the heart of Lutyens' Delhi, our premium hotel offers colonial elegance with contemporary luxury. Walking distance to India Gate and Connaught Place, it's the perfect base for exploring the capital.",
        city: "Delhi",
        state: "Delhi",
        address: "Janpath, Connaught Place, New Delhi 110001",
        pricePerNight: 9500,
        amenities: ["WiFi", "AC", "Gym", "Restaurant", "Bar", "Room Service", "Airport Shuttle", "Laundry"],
        images: [
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        ],
        rating: 4.4,
        totalReviews: 201,
        isApproved: true,
      },
      {
        ownerId: owner2._id,
        name: "Varanasi Ganga View",
        description: "A spiritual retreat overlooking the sacred ghats of Varanasi. Watch the mesmerizing Ganga Aarti from your room, explore ancient temples, and experience the soul of India in this boutique heritage hotel.",
        city: "Varanasi",
        state: "Uttar Pradesh",
        address: "Dashashwamedh Ghat Road, Varanasi 221001",
        pricePerNight: 4500,
        amenities: ["WiFi", "AC", "Restaurant", "Yoga Center", "Heritage Walk", "Room Service"],
        images: [
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
        ],
        rating: 4.6,
        totalReviews: 178,
        isApproved: true,
      },
    ]);

    // Create rooms for each hotel
    const roomTypes = [
      { type: "Standard", priceFactor: 1, capacity: 2 },
      { type: "Deluxe", priceFactor: 1.5, capacity: 2 },
      { type: "Suite", priceFactor: 2.2, capacity: 3 },
      { type: "Royal Suite", priceFactor: 3, capacity: 4 },
    ];

    for (const hotel of hotels) {
      for (const rt of roomTypes) {
        await Room.create({
          hotelId: hotel._id,
          type: rt.type,
          price: Math.round(hotel.pricePerNight * rt.priceFactor),
          capacity: rt.capacity,
          availabilityStatus: true,
          description: `${rt.type} room with premium amenities and ${rt.capacity} guest capacity.`,
          images: hotel.images,
        });
      }
    }

    return NextResponse.json({
      message: "✅ Database seeded successfully!",
      credentials: {
        admin: { email: "admin@smarthotel.in", password: "admin123" },
        owner1: { email: "rajesh@smarthotel.in", password: "owner123" },
        owner2: { email: "priya@smarthotel.in", password: "owner123" },
        customer: { email: "amit@gmail.com", password: "customer123" },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}