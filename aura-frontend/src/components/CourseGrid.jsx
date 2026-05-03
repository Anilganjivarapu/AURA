const formatPrice = (price) => `Rs ${Number(price || 0).toLocaleString("en-IN")}`;

const CourseGrid = ({ courses, role, onEnroll, onCheckout, paymentProvider = "razorpay" }) => (
  <div className="grid gap-5 xl:grid-cols-3">
    {courses.map((course) => (
      <article
        key={course._id || course.id}
        className="flex h-full flex-col rounded-[28px] border border-white/10 bg-slate-950/35 p-5"
      >
        {course.image ? (
          <img src={course.image} alt={course.title} className="mb-5 h-44 w-full rounded-[22px] object-cover" />
        ) : null}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-aura-gold">Course</p>
            <h3 className="mt-2 font-display text-2xl text-white">{course.title}</h3>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
            {course.duration}
          </span>
        </div>
        <p className="text-sm leading-7 text-slate-300">{course.description}</p>
        <div className="mt-6 flex flex-1 flex-col justify-end border-t border-white/10 pt-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Investment</p>
            <p className="mt-2 text-xl font-semibold text-aura-sand">{formatPrice(course.price)}</p>
          </div>
          {role === "student" ? (
            <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2">
              <button
                type="button"
                className="secondary-button w-full sm:min-w-[132px]"
                onClick={() => onEnroll(course._id || course.id)}
              >
                Enroll
              </button>
              <button
                type="button"
                className="primary-button w-full sm:min-w-[168px]"
                onClick={() => onCheckout(course._id || course.id, paymentProvider)}
              >
                Pay with {paymentProvider === "stripe" ? "Stripe" : "Razorpay"}
              </button>
            </div>
          ) : null}
          </div>
        </div>
      </article>
    ))}
  </div>
);

export default CourseGrid;
