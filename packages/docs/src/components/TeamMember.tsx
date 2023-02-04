import { For, Show } from 'solid-js'
import type { Component } from 'solid-js'
import type { CoreTeam } from '../data/contributors'

export const TeamMember: Component<{ data: CoreTeam }> = props => {
  const { data } = props
  return (
    <div text-center>
      <img
        loading="lazy"
        width="100"
        height="100"
        m-auto
        rounded-full
        min-w-25
        min-h-25
        h-25
        w-25
        src={data.avatar}
        alt={`${data.name}'s avatar`}
      />
      <div text-xl mt-2 mb-1>
        {data.name}
      </div>
      <div op60 h-80px innerHTML={data.description} />

      <div flex="~ inline gap-2" py2 text-2xl>
        <a
          class="i-carbon-logo-github inline-block text-current op30 hover:op100 mya transition duration-200"
          href={`https://github.com/${data.github}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${data.name} on GitHub`}
        />
        <Show when={data.twitter}>
          <a
            class="i-carbon-logo-twitter inline-block text-1.3em mya text-current op30 hover:op100 transition duration-200"
            href={`https://twitter.com/${data.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${data.name} on Twitter`}
          />
        </Show>
        <Show when={data.sponsors}>
          <a
            class="i-carbon-favorite-filled inline-block mya text-current op30 hover:op100 transition duration-200"
            href={`https://github.com/sponsors/${data.github}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`Sponsor ${data.name}`}
            aria-label={`Sponsor ${data.name}`}
          />
        </Show>
      </div>
      <Show when={!!(data.functions ?? data.packages)}>
        <div bg-gray mb2 p2 rounded grid="~ cols-[20px_1fr] gap-y-2" items-start w="5/6" mxa>
          <Show when={!!data.functions}>
            <div op50 i-carbon:function-math title="Functions">
              <div flex="~ col gap-1" text-left text-sm w-max>
                <For each={data.functions}>
                  {f => (
                    <a href={`/${f}`} target="_blank">
                      <code>{f}</code>
                    </a>
                  )}
                </For>
              </div>
            </div>
          </Show>
          <Show when={!!data.packages}>
            <div op50 i-carbon-cube title="Packages">
              <div flex="~ col gap-1" text-left text-sm w-max>
                <For each={data.packages}>
                  {f => (
                    <a href="/add-ons" target="_blank">
                      <code>@solid/{f}</code>
                    </a>
                  )}
                </For>
              </div>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  )
}
