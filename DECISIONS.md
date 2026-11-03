# Decision log

One entry per decision: the date, the decision and the evidence behind it.

| Date | Decision | Evidence |
| --- | --- | --- |
| 2026-11-03 | Swarm model: `openai:gpt-6-luna` (GPT-6 Luna) at reasoning effort `low`, the course default from Step 17 | 10-agent test batch cohort-T-20261103-0636: 0 crashed, 0 unclear replies, 2 failed actions (both recovered), 0 API retries; $0.0032 per agent; success 100% for curator, consumer-shared, builder and builder-team, 67% for consumer; misses were agent choices (declined $8 Pro, no accessibility or Rust skill in the catalogue) |
| 2026-11-03 | Swarm model confirmed: `openai:gpt-6-luna` at reasoning effort `low`, on the updated harness (links wait for the new page, timestamped trace steps) | 10-agent test batch cohort-T-20261103-0741: 0 crashed, 0 unclear replies, 1 failed action (recovered: payment iframe closed after a successful payment), 0 API retries; $0.0034 per agent; success 100% for curator, consumer-shared, builder and builder-team, 67% for consumer; misses were agent choices (declined $8 Pro, no accessibility or Rust skill in the catalogue); the /explore double click from cohort-T-20261103-0707 no longer occurs; PostHog has swarm-T events and a recording for all 10 agents |
