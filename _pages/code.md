---
layout: site
title: "Code & Data"
permalink: /code/
---

Code, data, and ongoing projects are also on [GitHub](https://github.com/cheyanneshariat).

<div class="cards wide">
{% for c in site.data.code %}
  <div class="card">
    <div class="card-body">
      <p class="card-title">{% if c.logo %}<img class="project-logo" src="{{ c.logo | relative_url }}" alt="">{% endif %}{{ c.name }}</p>
      <p class="card-text">{{ c.text }}</p>
      <ul class="link-row">{% for l in c.links %}<li><a href="{{ l.url | relative_url }}">{{ l.label }}</a></li>{% endfor %}</ul>
    </div>
  </div>
{% endfor %}
</div>
