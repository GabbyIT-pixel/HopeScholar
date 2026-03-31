"use strict";

const Finder = {
  selections: { level: null, subject: null, region: null, funding: null },

  init() {
    document.querySelectorAll(".finder-options").forEach((group) => {
      group.querySelectorAll(".finder-opt").forEach((btn) => {
        btn.addEventListener("click", () => {
          group
            .querySelectorAll(".finder-opt")
            .forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          const groupId = group.id;
          const key = groupId.replace("finder-", "");
          this.selections[key] = btn.dataset.val;
        });
      });
    });

    $("finder-submit")?.addEventListener("click", () => this.search());
    $("finder-reset")?.addEventListener("click", () => this.reset());
    $("finder-back")?.addEventListener("click", () => this.showForm());
  },

  search() {
    const { level, subject, region, funding } = this.selections;
    let results = [...SCHOLARSHIPS];

    if (level && level !== "") {
      results = results.filter((s) => {
        const l = s.level.toLowerCase();
        if (level === "Undergraduate")
          return l.includes("undergraduate") || l.includes("undergrad");
        if (level === "Postgraduate")
          return (
            l.includes("postgraduate") ||
            l.includes("postgrad") ||
            l.includes("masters") ||
            l.includes("master")
          );
        if (level === "PhD")
          return (
            l.includes("phd") ||
            l.includes("doctorate") ||
            l.includes("research")
          );
        if (level === "Pre-University")
          return l.includes("pre-university") || l.includes("pre-uni");
        return true;
      });
    }

    if (subject && subject !== "") {
      results = results.filter((s) => {
        const focus = s.focus.join(" ").toLowerCase();
        const desc = s.description.toLowerCase();
        const combined = focus + " " + desc;
        const subjectMap = {
          "Engineering & Technology": [
            "engineering",
            "technology",
            "tech",
            "innovation",
          ],
          "Computer Science & AI": [
            "computer science",
            "software",
            "ai",
            "data science",
            "computing",
            "cybersecurity",
            "it",
          ],
          "Business & Leadership": [
            "business",
            "leadership",
            "entrepreneurship",
            "management",
            "social good",
          ],
          "Medicine & Health": [
            "medicine",
            "health",
            "medical",
            "public health",
            "nursing",
          ],
          "Social Sciences": [
            "social",
            "community",
            "policy",
            "governance",
            "sociology",
          ],
          "Agriculture & Environment": [
            "agriculture",
            "environment",
            "water",
            "climate",
            "sustainable",
          ],
          "Mathematics & Data Science": [
            "mathematics",
            "data science",
            "math",
            "statistics",
            "ai",
          ],
          "Law & Policy": ["law", "policy", "governance", "political"],
          "Any Discipline": [],
        };
        const keywords = subjectMap[subject] || [];
        if (keywords.length === 0) return true;
        return keywords.some((kw) => combined.includes(kw));
      });
    }

    if (region && region !== "") {
      results = results.filter((s) => s.region === region);
    }

    if (funding && funding !== "") {
      results = results.filter((s) => s.category === funding);
    }

    this.showResults(results, level, subject, region, funding);
  },

  showResults(results, level, subject, region, funding) {
    const titleParts = [];
    if (level) titleParts.push(level);
    if (subject && subject !== "Any Discipline") titleParts.push(subject);
    if (region)
      titleParts.push(
        {
          africa: "Africa",
          usa: "USA",
          uk: "United Kingdom",
          europe: "Europe",
          canada: "Canada",
        }[region] || region,
      );

    const title =
      results.length > 0
        ? `${results.length} scholarship${results.length !== 1 ? "s" : ""} matched${titleParts.length ? " for " + titleParts.join(" · ") : ""}`
        : "No scholarships matched your criteria";

    $("finder-results-title").textContent = title;

    if (!results.length) {
      $("finder-results-grid").innerHTML = `<div class="empty-inline">
        <div class="empty-icon">F</div>
        <h2>No exact matches found</h2>
        <p>Try selecting "Anywhere" for destination or "Any Discipline" for subject, then search again.</p>
      </div>`;
    } else {
      $("finder-results-grid").innerHTML = results
        .map((s) => Scholarships._card(s))
        .join("");
    }

    $("finder-form").style.display = "none";
    $("finder-results").style.display = "block";
  },

  showForm() {
    $("finder-form").style.display = "flex";
    $("finder-results").style.display = "none";
  },

  reset() {
    this.selections = {
      level: null,
      subject: null,
      region: null,
      funding: null,
    };
    document
      .querySelectorAll(".finder-opt")
      .forEach((b) => b.classList.remove("active"));
    this.showForm();
  },
};
