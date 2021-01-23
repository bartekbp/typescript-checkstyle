import format from './format';

test('Empty input produces empty valid checkstyle file', () => {
  expect(format('')).toEqualXML(`
<?xml version="1.0" encoding="utf-8"?>
<checkstyle version="4.3">
</checkstyle>`);
});

test('Input with one line produces checkstyle with one violation', () => {
  const input = `
src/test.component.ts(3, 12): error TS2564: Property 'name' has no initializer
`;

  const output = `
<?xml version="1.0" encoding="utf-8"?>
<checkstyle version="4.3">
  <file name="src/test.component.ts">
    <error line="3" column="12" severity="error" message="Property &apos;name&apos; has no initializer" source="TS2564" />
  </file>
</checkstyle>`;

  expect(format(input)).toEqualXML(output);
});

test('Parses input with linux line endings', () => {
  const input = 'test.ts(3, 12): error TS2564: message\ntest.ts(4, 12): error TS2564: message'

  const output = `
<?xml version="1.0" encoding="utf-8"?>
<checkstyle version="4.3">
  <file name="test.ts">
    <error line="3" column="12" severity="error" message="message" source="TS2564" />
    <error line="4" column="12" severity="error" message="message" source="TS2564" />
  </file>
</checkstyle>`;

  expect(format(input)).toEqualXML(output);
});


test('Parses input with windows line endings', () => {
  const input = 'test.ts(3, 12): error TS2564: message\r\ntest.ts(4, 12): error TS2564: message'

  const output = `
<?xml version="1.0" encoding="utf-8"?>
<checkstyle version="4.3">
  <file name="test.ts">
    <error line="3" column="12" severity="error" message="message" source="TS2564" />
    <error line="4" column="12" severity="error" message="message" source="TS2564" />
  </file>
</checkstyle>`;

  expect(format(input)).toEqualXML(output);
});

test('Input with two lines for the same file line produces checkstyle with one file and two violations', () => {
  const input = `
src/test.component.ts(12,3): error TS2564: Property 'name' has no initializer
src/test.component.ts(13,3): error TS2564: Property 'name' has no initializer
`;

  const output = `
<?xml version="1.0" encoding="utf-8"?>
<checkstyle version="4.3">
  <file name="src/test.component.ts">
    <error line="12" column="3" severity="error" message="Property &apos;name&apos; has no initializer" source="TS2564" />
    <error line="13" column="3" severity="error" message="Property &apos;name&apos; has no initializer" source="TS2564" />
  </file>
</checkstyle>`;

  expect(format(input)).toEqualXML(output);
});

test('Input with two lines for different files line produces checkstyle with two files and one violations for each', () => {
  const input = `
src/test.component.ts(12,3): error TS2564: Property 'name' has no initializer
src/test2.component.ts(13,3): error TS2564: Property 'name' has no initializer
`;

  const output = `
<?xml version="1.0" encoding="utf-8"?>
<checkstyle version="4.3">
  <file name="src/test.component.ts">
    <error line="12" column="3" severity="error" message="Property &apos;name&apos; has no initializer" source="TS2564" />
  </file>
  <file name="src/test2.component.ts">
    <error line="13" column="3" severity="error" message="Property &apos;name&apos; has no initializer" source="TS2564" />
  </file>
</checkstyle>`;

  expect(format(input)).toEqualXML(output);
});

