import { motion } from "framer-motion";

const timeline = [
  {
    year: "2020",
    title: "The Beginning",
    text: "During the pandemic, Tashekari began as a personal journey to learn something creative and meaningful.",
  },
  {
    year: "2021",
    title: "Learning the Craft",
    text: "A full year was spent learning macrame, experimenting with knots and creating handmade products independently.",
  },
  {
    year: "2022",
    title: "First Orders",
    text: "The first customer orders brought confidence, encouragement and the vision to build a real handmade brand.",
  },
  {
    year: "2023",
    title: "Growing Together",
    text: "Tashekari started growing beyond one person, creating space for teamwork, skills and new opportunities.",
  },
  {
    year: "Today",
    title: "A Community with Purpose",
    text: "Today, Tashekari creates thoughtful products while supporting creativity, employment and sustainable living.",
  },
];

export default function StoryTimeline() {
  return (
    <section
      id="our-journey"
      className="bg-white py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="font-body text-xs uppercase tracking-[0.38em] text-secondary">
            Our Journey
          </p>

          <h2 className="mt-5 font-heading text-5xl font-semibold text-primary md:text-6xl">
            From One Dream to a Growing Team
          </h2>

          <p className="mx-auto mt-5 max-w-3xl font-body leading-8 text-[#75695F]">
            Tashekari grew slowly, thoughtfully and with purpose. Every stage
            added a new lesson, a new opportunity and a stronger reason to keep
            creating.
          </p>
        </motion.div>

        <div className="relative mt-20">
          <div className="absolute left-5 top-0 h-full w-px bg-primary/15 md:left-1/2" />

          <div className="space-y-14">
            {timeline.map((item, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className={`relative grid items-center gap-8 md:grid-cols-2 ${
                    isLeft ? "" : "md:text-right"
                  }`}
                >
                  <div
                    className={
                      isLeft
                        ? "pl-16 md:pl-0 md:pr-16 md:text-right"
                        : "hidden md:block"
                    }
                  >
                    {isLeft && (
                      <div className="rounded-[30px] bg-background p-8 shadow-sm">
                        <p className="font-heading text-4xl font-semibold text-secondary">
                          {item.year}
                        </p>

                        <h3 className="mt-3 font-heading text-3xl font-semibold text-primary">
                          {item.title}
                        </h3>

                        <p className="mt-4 font-body leading-8 text-[#75695F]">
                          {item.text}
                        </p>
                      </div>
                    )}
                  </div>

                  <div
                    className={
                      isLeft
                        ? "hidden md:block"
                        : "pl-16 md:pl-16 md:text-left"
                    }
                  >
                    {!isLeft && (
                      <div className="rounded-[30px] bg-background p-8 shadow-sm">
                        <p className="font-heading text-4xl font-semibold text-secondary">
                          {item.year}
                        </p>

                        <h3 className="mt-3 font-heading text-3xl font-semibold text-primary">
                          {item.title}
                        </h3>

                        <p className="mt-4 font-body leading-8 text-[#75695F]">
                          {item.text}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="absolute left-0 top-8 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-primary shadow-md md:left-1/2 md:-translate-x-1/2">
                    <div className="h-3 w-3 rounded-full bg-secondary" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}