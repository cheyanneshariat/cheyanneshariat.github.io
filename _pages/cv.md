---
layout: site
title: "CV"
permalink: /cv/
redirect_from:
  - /resume
---

<div class="buttons" style="margin-top: 0">
  <a class="button primary" href="{{ '/files/Shariat_Cheyanne_CV.pdf' | relative_url }}">Download full CV (PDF)</a>
  <a class="button" href="{{ '/publications/' | relative_url }}">Publications</a>
</div>

{% for s in site.data.cv_web %}
<section class="cv-section">
  <h2>{{ s.section }}</h2>
  <ul class="cv-list">
    {% for i in s.items %}
    <li><span class="cv-what">{{ i.what | markdownify | remove: "<p>" | remove: "</p>" | strip }}</span>{% if i.detail %}<span class="cv-detail">{{ i.detail }}</span>{% endif %}<span class="cv-when">{{ i.when }}</span></li>
    {% endfor %}
  </ul>
</section>
{% endfor %}
