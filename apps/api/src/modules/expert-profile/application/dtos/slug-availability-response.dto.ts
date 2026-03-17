export class SlugAvailabilityResponseDto {
  available: boolean;
  slug: string;

  constructor(slug: string, available: boolean) {
    this.slug = slug;
    this.available = available;
  }
}
