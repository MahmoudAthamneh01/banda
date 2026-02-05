export default async function TrackOrderPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Track Order #{params.id}</h1>
      <div className="space-y-6">
        <div className="border rounded-lg p-6">
          <h3 className="font-bold mb-4">Order Status</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div>
                <p className="font-medium">Order Placed</p>
                <p className="text-sm text-gray-600">2026-01-29 10:00</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div>
                <p className="font-medium">Payment Confirmed</p>
                <p className="text-sm text-gray-600">2026-01-29 10:05</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                3
              </div>
              <div>
                <p className="font-medium text-gray-500">In Transit</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
