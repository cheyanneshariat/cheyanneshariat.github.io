---
layout: site
title: "Media"
permalink: /media/
---

<div class="cards wide">
{% for m in site.data.media %}
  <div class="card">
    <div class="card-body">
      <p class="card-title">{{ m.title }}</p>
      <ul class="link-row">{% for l in m.links %}<li><a href="{{ l.url }}">{{ l.source }}</a></li>{% endfor %}</ul>
    </div>
  </div>
{% endfor %}
</div>
