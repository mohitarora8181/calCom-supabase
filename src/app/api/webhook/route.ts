import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: Request) {

    const data = await req.json();
    const { createdAt, payload } = data;

    if (payload["status"] == "ACCEPTED") {
        const { eventTitle,startTime,endTime, bookingId, attendees, metadata } = payload;

        const { error } = await supabase
            .from('appointment_scheduled')
            .insert({
                createdAt,
                eventTitle,
                bookingId,
                timings:`${new Date(startTime).toLocaleTimeString()} - ${new Date(endTime).toLocaleTimeString()}`,
                attendeeName: attendees[0]["name"],
                attendeeEmail: attendees[0]["email"],
                videoCallUrl: metadata["videoCallUrl"],
            });
        if (error) {
            console.log(error);
            return Response.json({ message: 'Internal server Error' }, { status: 500 });
        }
    } else if (payload["status"] == "CANCELLED") {
        const { eventTitle, bookingId, cancellationReason, cancelledBy } = payload;
        const { error } = await supabase
            .from('appointment_cancelled')
            .insert({
                createdAt,
                eventTitle,
                bookingId,
                cancellationReason,
                cancelledBy
            });
        if (error) {
            console.log(error);
            return Response.json({ message: 'Internal server Error' }, { status: 500 });
        }
    }

    return Response.json({ message: 'Hello , for more info visit here https://github.com/mohitarora8181' }, { status: 200 });
}