import { render, screen } from "@testing-library/react";

import LoadingIndicator from "~/components/LoadingIndicator";

describe("LoadingIndicator", () => {
  test("renders the correct content", () => {
    render(<LoadingIndicator />);
    expect(screen.getByText("Loading ...")).toBeInTheDocument();
  });
});
