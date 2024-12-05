/**
 * @class SeededRandom
 * @brief A pseudo-random number generator (PRNG) that produces repeatable random sequences based on an initial seed.
 */
class SeededRandom {
  /**
   * @brief Constructs a new SeededRandom object with the specified seed.
   *
   * @param seed The initial seed for the random number generator. Must be a positive integer.
   */
  constructor(seed) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  /**
   * @brief Generates the next random number in the sequence.
   *
   * @return A normalized random number in the range [0, 1).
   */
  next() {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  /**
   * @brief Generates a random integer within a specified range [min, max].
   *
   * @param min The lower bound of the range (inclusive).
   * @param max The upper bound of the range (inclusive).
   * @return A random integer between min and max (inclusive).
   */
  randomInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}
