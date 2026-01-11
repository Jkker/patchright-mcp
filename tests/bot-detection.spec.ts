/**
 * Copyright (c) Jkker.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Test to verify Patchright MCP can access bot detection sites undetected
 */

import { test, expect } from './fixtures';

test('verify undetected on bot.sannysoft.com', async ({ client }) => {
  // Navigate to bot detection test site
  const result = await client.callTool({
    name: 'browser_navigate',
    arguments: { url: 'https://bot.sannysoft.com/' },
  });
  
  // Check for the page snapshot content
  const text = result.content[0].text;
  console.log('Result:', text.substring(0, 2000));
  
  // The page should load successfully (no error)
  expect(result.isError).toBeFalsy();
  
  // The page should contain the bot test results
  expect(text).toContain('bot.sannysoft.com');
});

test('verify webdriver detection is passed', async ({ client }) => {
  // Navigate to bot detection test site
  await client.callTool({
    name: 'browser_navigate',
    arguments: { url: 'https://bot.sannysoft.com/' },
  });
  
  // Evaluate script to check webdriver detection
  const result = await client.callTool({
    name: 'browser_evaluate',
    arguments: { 
      function: '() => navigator.webdriver' 
    },
  });
  
  const text = result.content[0].text;
  console.log('Webdriver result:', text);
  
  // Patchright should make navigator.webdriver return false or undefined, not true
  expect(text).not.toContain('true');
});

test('verify undetected on browserscan.net', async ({ client }) => {
  // Navigate to browserscan.net
  const result = await client.callTool({
    name: 'browser_navigate',
    arguments: { url: 'https://www.browserscan.net/bot-detection' },
  });
  
  // Check for the page snapshot content
  const text = result.content[0].text;
  console.log('Browserscan Result (first 1500 chars):', text.substring(0, 1500));
  
  // The page should load successfully (no error)
  expect(result.isError).toBeFalsy();
});
