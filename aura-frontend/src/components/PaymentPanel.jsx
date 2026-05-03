const PaymentPanel = ({ payments, checkoutState, paymentProvider, onProviderChange, onVerifyDemo }) => (
  <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
    <div className="space-y-4">
      {payments.length ? (
        payments.map((payment) => (
          <div
            key={payment._id || payment.id}
            className="rounded-[24px] border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-aura-gold">{payment.method || payment.provider}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  Rs {Number(payment.amount || 0).toLocaleString("en-IN")}
                </h3>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200">
                {payment.status}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-300">Method: {payment.method || payment.provider || "Pending"}</p>
            <p className="mt-1 text-sm text-slate-400">Receipt: {payment.receipt || "Generating..."}</p>
          </div>
        ))
      ) : (
        <div className="rounded-[24px] border border-dashed border-white/10 p-6 text-sm text-slate-300">
          No payments yet. Start a checkout from a course card to populate history.
        </div>
      )}
    </div>

    <div className="rounded-[28px] border border-aura-gold/20 bg-aura-gold/10 p-5">
      <h3 className="font-display text-2xl text-aura-sand">Payments included</h3>
      <p className="mt-3 text-sm leading-7 text-slate-200">
        Students can pay using Razorpay today, and Stripe-ready checkout is also wired as an optional path.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {["razorpay", "stripe"].map((provider) => (
          <button
            key={provider}
            type="button"
            className={`rounded-2xl px-4 py-3 text-sm font-semibold capitalize ${
              paymentProvider === provider ? "bg-white text-slate-950" : "border border-white/10 bg-white/5 text-white"
            }`}
            onClick={() => onProviderChange(provider)}
          >
            {provider}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-[24px] border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-200">
        <p>Checkout mode: {paymentProvider === "stripe" ? "Card / wallet via Stripe" : "UPI / Card / Netbanking via Razorpay"}</p>
        <p className="mt-2">Auto receipts and payment history are stored in the platform.</p>
      </div>

      {checkoutState ? (
        <div className="mt-6 space-y-3 rounded-[24px] border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-200">
          <p>Provider: {checkoutState.checkout.provider}</p>
          <p>Order: {checkoutState.checkout.orderId}</p>
          <p>Amount: Rs {Number(checkoutState.checkout.amount || 0).toLocaleString("en-IN")}</p>
          <p>Mode: {checkoutState.checkout.demoMode ? "Demo checkout" : "Live checkout ready"}</p>
          {checkoutState.checkout.demoMode ? (
            <button type="button" className="primary-button mt-2 w-full" onClick={onVerifyDemo}>
              Mark demo payment as successful
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  </div>
);

export default PaymentPanel;
