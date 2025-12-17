import { ConverterContainer } from "@/components/converter/ConverterContainer";
import { TestModeProvider } from "@/components/providers/TestModeProvider";

export default function Home() {
  return (
    <TestModeProvider>
      <ConverterContainer />
    </TestModeProvider>
  );
}
