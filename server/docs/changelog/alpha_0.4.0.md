# Alpha 0.4.0

## Changes

- Created the `Tag` model for ticket categorization.
- Implemented and documented the `GET /api/tags/`, `GET /api/tags/<tag_id>`, `POST /api/tags/`, `PATCH /api/tags/<tag_id>` and `DELETE /api/tags/<tag_id>` endpoints for full Tag CRUD management.
- Documented the tags module in the [Tags API Documentation](../api/tags.md).
- Created Swagger specifications for the tags module under `docs/swagger/tags/`.
- Integrated the Swagger documentation with the API using `swag_from`.

## Bug fixes

- Fixed some import errors in the `Tag` model extension.

## Notes

- This update introduces the base for ticket tagging system.
- Tags are restricted to 20 characters and must be unique.
